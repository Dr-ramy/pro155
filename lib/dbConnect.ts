import mongoose, { Mongoose } from "mongoose";

// تحقق من متغير البيئة
function assertEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`❌ متغير البيئة ${name} غير معرف`);
  }
  return value;
}

const MONGODB_URI = assertEnv(process.env.MONGODB_URI, "MONGODB_URI");

// نوع التخزين المؤقت
type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

// تعريف المتغير العالمي
declare global {
  var mongoose: MongooseCache | undefined;
}

const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose?: MongooseCache;
};

globalWithMongoose.mongoose ||= { conn: null, promise: null };

export default async function dbConnect(): Promise<Mongoose> {
  const cached = globalWithMongoose.mongoose!;

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongooseInstance) => {
      console.log("✅ تم الاتصال بقاعدة البيانات MongoDB");
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
