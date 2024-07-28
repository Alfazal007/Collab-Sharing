"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const MessageType_1 = require("./MessageType");
const User_1 = require("./User");
const authHelper_1 = require("./authHelper");
const redis_1 = require("redis");
class UserManager {
    constructor() {
        this.userMap = new Map();
        // empty constructor so no new objects can be created
        this.redisClient = (0, redis_1.createClient)({
            url: process.env.REDIS_URL,
            password: process.env.REDIS_PASSWORD,
        });
    }
    static getInstance() {
        if (!UserManager.singeleInstance) {
            UserManager.singeleInstance = new UserManager();
        }
        return UserManager.singeleInstance;
    }
    addHandler(ws) {
        ws.on("message", (data) => __awaiter(this, void 0, void 0, function* () {
            const message = JSON.parse(data.toString());
            if (message.type == MessageType_1.CONNECTTOSOCKET) {
                // change this logic add handler to extract user information from the data validate it and then add user to this list and make authenticated to be true based on database calls made
                yield this.addUser(ws, message);
            }
            else if (message.type == MessageType_1.CHAT) {
                if (!message.to || message.to == "") {
                    return;
                }
                let receiver = this.userMap.get(message.to);
                if (receiver) {
                    receiver.connection.send(JSON.stringify({
                        type: MessageType_1.CHAT,
                        message: message.message,
                    }));
                }
                else {
                    // send the message to the database via redis
                    yield this.addRedis(ws, message);
                }
            }
            else {
                ws.close();
                for (const [key, value] of this.userMap) {
                    if (value.connection === ws) {
                        this.userMap.delete(key);
                        break;
                    }
                }
            }
        }));
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
    addUser(ws, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!message.email ||
                message.email.length <= 0 ||
                !message.token ||
                message.token.length <= 0) {
                ws.close();
                return;
            }
            // handle authentication and exchange of messages
            const isAuthenticatedUser = yield (0, authHelper_1.authenticatedUser)(message.token, message.email);
            if (isAuthenticatedUser) {
                if (!this.userMap.has(message.email)) {
                    this.userMap.set(message.email, new User_1.User(ws, message.email, true));
                }
            }
            else {
                // disconnect the connection
                ws.close();
            }
        });
    }
    addRedis(ws, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!message.message ||
                message.message == "" ||
                !message.to ||
                message.to == "") {
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
                    yield this.redisClient.connect();
                }
                yield this.redisClient.lPush("database-redis-sync", JSON.stringify({
                    message: message.message,
                    to: message.to,
                    from,
                }));
            }
            catch (err) {
                console.log(err.message);
            }
        });
    }
}
exports.UserManager = UserManager;
