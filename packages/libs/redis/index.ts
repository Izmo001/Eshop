import Redis from "ioredis";
/*Eslint-disable @typescript-eslint/no-non-null-assertion */
console.log("Redis URI:", process.env.REDIS_DATABASE_URI);
if (!process.env.REDIS_DATABASE_URI) {
  throw new Error("REDIS_DATABASE_URI is not defined");
}
const redis = new Redis(process.env.REDIS_DATABASE_URI,);

export default redis;