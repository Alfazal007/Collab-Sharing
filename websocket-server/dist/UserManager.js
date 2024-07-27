"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const MessageType_1 = require("./MessageType");
const User_1 = require("./User");
class UserManager {
    constructor() {
        this.users = [];
        // empty constructor so no new objects can be created
    }
    static getInstance() {
        if (!UserManager.singeleInstance) {
            UserManager.singeleInstance = new UserManager();
        }
        return UserManager.singeleInstance;
    }
    addHandler(ws) {
        ws.on("message", (data) => {
            const message = JSON.parse(data.toString());
            console.log(message);
            if (message.type == MessageType_1.CONNECTTOSOCKET) {
                // change this logic add handler to extract user information from the data validate it and then add user to this list and make authenticated to be true based on database calls made
                this.addUser(ws, message);
                console.log(this.users);
            }
            else if (message.type == MessageType_1.CHAT) {
                this.users.forEach((user) => {
                    console.log(user.email);
                    console.log(message.to);
                    console.log("FOUND");
                    if (user.email === message.to) {
                        user.connection.send(JSON.stringify({
                            type: MessageType_1.CHAT,
                            message: message.message,
                        }));
                    }
                });
            }
            else {
                console.log("Invalid data");
            }
        });
    }
    addUser(ws, message) {
        this.users.push(new User_1.User(ws, message.email || "")); // update here
        console.log(this.users);
    }
}
exports.UserManager = UserManager;
