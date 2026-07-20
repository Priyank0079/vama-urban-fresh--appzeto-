import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../app/models/admin.js';
import Seller from '../app/models/seller.js';
import User from '../app/models/customer.js';
import Delivery from '../app/models/delivery.js';

dotenv.config();

const phone = '9111966732';
const password = '123456';
const adminEmail = 'admin@gmail.com';

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME });
        console.log('Connected to MongoDB');

        // 1. User (Customer)
        let user = await User.findOne({ phone });
        if (user) {
            user.password = password;
            user.isVerified = true;
            await user.save();
            console.log('Updated User:', phone);
        } else {
            await User.create({ 
                name: 'Test User', 
                phone, 
                password: password, 
                role: 'user', 
                isVerified: true 
            });
            console.log('Created User:', phone);
        }

        // 2. Delivery
        let delivery = await Delivery.findOne({ phone });
        if (delivery) {
            delivery.password = password;
            delivery.status = 'active';
            await delivery.save();
            console.log('Updated Delivery:', phone);
        } else {
            await Delivery.create({
                name: 'Test Delivery',
                phone,
                password: password,
                status: 'active',
                isVerified: true
            });
            console.log('Created Delivery:', phone);
        }

        // 3. Seller
        let seller = await Seller.findOne({ email: `${phone}@test.com` }); // or phone
        if (seller) {
            seller.password = password; // pre-save hook in Seller?
            seller.phone = phone;
            seller.isActive = true;
            seller.applicationStatus = 'approved';
            await seller.save();
            console.log('Updated Seller:', phone);
        } else {
            await Seller.create({
                name: 'Test Seller',
                email: `${phone}@test.com`,
                phone,
                password: password, // seedCredentials didn't hash manually
                shopName: 'Test Shop',
                role: 'seller',
                isVerified: true,
                isActive: true,
                applicationStatus: 'approved'
            });
            console.log('Created Seller:', phone);
        }

        // 4. Admin
        let admin = await Admin.findOne({ email: adminEmail });
        if (admin) {
            admin.password = password;
            await admin.save();
            console.log('Updated Admin:', adminEmail);
        } else {
            await Admin.create({
                name: 'Admin',
                email: adminEmail,
                password: password,
                role: 'admin',
                isVerified: true
            });
            console.log('Created Admin:', adminEmail);
        }

        console.log('Credentials update completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error updating credentials:', error);
        process.exit(1);
    }
}

seed();
