import mongoose from "mongoose";
import appConfig from "./app-config";

async function connect(): Promise<void> {
    try {
        // variable = mongoose>connect using connection string.
        const db = await mongoose.connect(appConfig.mongodbConnectionString);
        console.log(`We're connected to ${db.connections[0].name} on MongoDB`);
    } catch (err: any) {
        console.log(err);
    }
}

export default {
    connect
};