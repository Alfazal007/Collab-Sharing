import { createClient, RedisClientType } from "redis";

let client: RedisClientType | null = null;

export async function getClient(): Promise<RedisClientType | null> {
    if (client != null) {
        return client;
    } else {
        try {
            client = createClient({
                url: process.env.REDIS_URL,
                password: process.env.REDIS_PASSWORD,
            });
            await client.connect();
            console.log("Connected to Redis");
        } catch (error) {
            console.error("Failed to connect to Redis", error);
        }
    }
    return client;
}
