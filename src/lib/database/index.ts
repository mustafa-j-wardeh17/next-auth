import mongoose from 'mongoose';

const MONGODB_URI: any = process.env.MONGODB_URI;


let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!MONGODB_URI) {
        throw new Error('Please add your Mongo URI to .env.local');
    }

    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
    })


    cached.conn = await cached.promise;
    return cached.conn;
}