import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGO_URI;

const CategorySchema = new mongoose.Schema({}, { strict: false });
const Category = mongoose.model('Category', CategorySchema, 'categories');

async function update() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri);
        console.log("Connected successfully!");

        // Find "All" or "ALL" categories
        const allCats = await Category.find({ 
            $or: [
                { name: /all/i },
                { slug: /all/i }
            ]
        });
        
        console.log("Found matches in database:", allCats);

        if (allCats.length > 0) {
            const result = await Category.updateMany(
                { 
                    $or: [
                        { name: /all/i },
                        { slug: /all/i }
                    ]
                },
                { 
                    $set: { 
                        headerColor: "#E11D48",
                        headerFontColor: "#ffffff",
                        headerIconColor: "#ffffff"
                    } 
                }
            );
            console.log("Update result:", result);
        } else {
            console.log("No category named 'All' found in database.");
        }

        await mongoose.disconnect();
        console.log("Disconnected successfully!");
    } catch (e) {
        console.error("Error during update:", e);
    }
}

update();
