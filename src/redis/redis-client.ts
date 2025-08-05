import Redis from "ioredis";

export const RedisClient = new Redis(process.env.REDIS_URL)