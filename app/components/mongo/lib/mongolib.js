import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Змінна середовища MONGODB_URI не встановлена");
}

// Глобальний кеш для з'єднання
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    console.log("Використовується кешоване підключення до бази даних");
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    };

    // Підключення до MongoDB
    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      console.log("Підключено до бази даних MongoDB");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
