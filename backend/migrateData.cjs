const { MongoClient } = require('mongodb');
require('dotenv').config();

const oldUri = process.env.OLD_MONGO_URI;
const newUri = process.env.NEW_MONGO_URI;
const newDbName = process.env.NEW_DB_NAME || 'vamaaururbanfresh';

async function migrate() {
    console.log("Connecting to old database...");
    const oldClient = new MongoClient(oldUri);
    try {
        await oldClient.connect();
    } catch (e) {
        console.error("Failed to connect to OLD database. Is your IP whitelisted on the old cluster? Is it paused?", e.message);
        return;
    }
    const oldDb = oldClient.db(); 
    console.log(`Connected to old database: ${oldDb.databaseName}`);

    console.log("Connecting to new database...");
    const newClient = new MongoClient(newUri);
    try {
        await newClient.connect();
        const newDb = newClient.db(newDbName);
        console.log(`Connected to new database: ${newDb.databaseName}`);

        const collections = await oldDb.listCollections().toArray();
        console.log(`Found ${collections.length} collections to copy.`);

        for (let colInfo of collections) {
            const colName = colInfo.name;
            console.log(`Copying collection: ${colName}...`);
            const oldCollection = oldDb.collection(colName);
            const newCollection = newDb.collection(colName);

            const docs = await oldCollection.find({}).toArray();
            if (docs.length > 0) {
                try {
                    await newDb.collection(colName).drop();
                } catch (e) {
                }
                await newCollection.insertMany(docs);
                console.log(` -> Copied ${docs.length} documents into ${colName}.`);
            } else {
                console.log(` -> Collection ${colName} is empty. Skipped.`);
            }
        }
        
        console.log("Migration completed successfully!");
    } catch (error) {
        console.error("Migration failed:", error.message);
    } finally {
        await oldClient.close();
        await newClient.close();
    }
}

migrate();
