import mongoose from "mongoose";
import Setting from "./app/models/setting.js";
import dotenv from "dotenv";

dotenv.config();

const updateSetting = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME });
        console.log("Connected to DB");

        const result = await Setting.updateMany({}, {
            $set: { appName: "Vamaa Urban Fresh" }
        });

        console.log("Update result:", result);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        mongoose.disconnect();
    }
};

updateSetting();
