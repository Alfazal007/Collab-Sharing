import { WebSocket } from "ws";
import { CHAT, CONNECTTOSOCKET, Message } from "./MessageType";
import { User } from "./User";
import { authenticatedUser } from "./authHelper";
import { createClient, RedisClientType } from "redis";

export class UserManager {
    // export singleton and a map of users
    private static singeleInstance: UserManager;
    private userMap = new Map<string, User>();
    private redisClient: RedisClientType;
    constructor() {
        // empty constructor so no new objects can be created
        this.redisClient = createClient({
            url: process.env.REDIS_URL,
            password: process.env.REDIS_PASSWORD,
        });
    }

    public static getInstance(): UserManager {
        if (!UserManager.singeleInstance) {
            UserManager.singeleInstance = new UserManager();
        }
        return UserManager.singeleInstance;
    }

    addHandler(ws: WebSocket) {
        ws.on("message", async (data) => {
            const message: Message = JSON.parse(data.toString());
            if (message.type == CONNECTTOSOCKET) {
                // change this logic add handler to extract user information from the data validate it and then add user to this list and make authenticated to be true based on database calls made
                await this.addUser(ws, message);
            } else if (message.type == CHAT) {
                if (!message.to || message.to == "") {
                    return;
                }
                let receiver = this.userMap.get(message.to);
                if (receiver) {
                    receiver.connection.send(
                        JSON.stringify({
                            type: CHAT,
                            message: message.message,
                        })
                    );
                } else {
                    // send the message to the database via redis
                    await this.addRedis(ws, message);
                }
            } else {
                ws.close();
                for (const [key, value] of this.userMap) {
                    if (value.connection === ws) {
                        this.userMap.delete(key);
                        break;
                    }
                }
            }
        });
        ws.on("close", () => {
            for (const [key, value] of this.userMap) {
                if (value.connection === ws) {
                    this.userMap.delete(key);
                    break;
                }
            }
        });
        ws.on("error", () => {
            for (const [key, value] of this.userMap) {
                if (value.connection === ws) {
                    this.userMap.delete(key);
                    break;
                }
            }
        });
    }

    // this authenticates the user
    // makes authenticated new connection and adds the user to the layer of being handled
    async addUser(ws: WebSocket, message: Message) {
        if (
            !message.email ||
            message.email.length <= 0 ||
            !message.token ||
            message.token.length <= 0
        ) {
            ws.close();
            return;
        }
        // handle authentication and exchange of messages
        const isAuthenticatedUser: boolean = await authenticatedUser(
            message.token,
            message.email
        );
        if (isAuthenticatedUser) {
            if (!this.userMap.has(message.email)) {
                this.userMap.set(
                    message.email,
                    new User(ws, message.email, true)
                );
            }
        } else {
            // disconnect the connection
            ws.close();
        }
    }

    async addRedis(ws: WebSocket, message: Message) {
        if (
            !message.message ||
            message.message == "" ||
            !message.to ||
            message.to == ""
        ) {
            return;
        }
        let from = "";
        for (const [key, value] of this.userMap) {
            if (value.connection === ws) {
                from = key;
                break;
            }
        }
        if (from == "") {
            return;
        }
        try {
            if (!this.redisClient.isOpen) {
                await this.redisClient.connect();
            }
            await this.redisClient.lPush(
                "database-redis-sync",
                JSON.stringify({
                    message: message.message,
                    to: message.to,
                    from,
                })
            );
        } catch (err: any) {
            console.log(err.message);
        }
    }
}
