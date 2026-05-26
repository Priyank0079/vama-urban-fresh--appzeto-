import Transaction from "../models/transaction.js";
import Order from "../models/order.js";
import CheckoutGroup from "../models/checkoutGroup.js";
import { releaseReservedStockForOrder } from "./stockService.js";
import { clearOrderTracking } from "./firebaseService.js";

/**
 * Reverse stock and fail seller transaction when an order is cancelled
 * after stock was deducted at placement.
 *
 * This function is the single chokepoint hit by every cancellation path
 * (seller timeout, payment timeout, delivery timeout, customer cancel,
 * auto-cancel job), so realtime tracking cleanup is wired here once and
 * stays consistent regardless of which caller triggers the cancellation.
 */
export async function compensateOrderCancellation(order, orderIdString) {
  const existing = await Order.findById(order._id);
  if (existing) {
    await releaseReservedStockForOrder(existing, {
      reason: "Cancelled",
    });
    await existing.save();
  }

  await Transaction.findOneAndUpdate(
    { reference: orderIdString },
    { status: "Failed" },
  );

  if (existing?.checkoutGroupId) {
    const activeCount = await Order.countDocuments({
      checkoutGroupId: existing.checkoutGroupId,
      status: { $ne: "cancelled" },
      workflowStatus: { $ne: "CANCELLED" },
    });
    if (activeCount === 0) {
      await CheckoutGroup.updateOne(
        { checkoutGroupId: existing.checkoutGroupId },
        {
          $set: {
            status: "CANCELLED",
            paymentStatus: "FAILED",
            "stockReservation.status": "RELEASED",
            "stockReservation.releasedAt": new Date(),
          },
        },
      );
    }
  }

  // Fire-and-forget cleanup of realtime tracking nodes. Mongo state is
  // already cancelled at this point — keeping RTDB nodes around would
  // just leave stale "live" markers on customer maps and bloat costs.
  const canonicalOrderId = existing?.orderId || orderIdString;
  if (canonicalOrderId) {
    clearOrderTracking(canonicalOrderId).catch(() => {});
  }
}
