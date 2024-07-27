import { WebSocket } from "ws";
import { CHAT, CONNECTTOSOCKET, Message } from "./MessageType";
import { User } from "./User";

export class UserManager {
    private static singeleInstance: UserManager;
    private users: User[];
    constructor() {
        this.users = [];
        // empty constructor so no new objects can be created
    }

    public static getInstance(): UserManager {
        if (!UserManager.singeleInstance) {
            UserManager.singeleInstance = new UserManager();
        }
        return UserManager.singeleInstance;
    }

    addHandler(ws: WebSocket) {
        ws.on("message", (data) => {
            const message: Message = JSON.parse(data.toString());
            if (message.type == CONNECTTOSOCKET) {
                // change this logic add handler to extract user information from the data validate it and then add user to this list and make authenticated to be true based on database calls made
                this.addUser(ws, message);
            } else if (message.type == CHAT) {
                this.users.forEach((user) => {
                    if (user.email === message.to) {
                        user.connection.send(
                            JSON.stringify({
                                type: CHAT,
                                message: message.message,
                            })
                        );
                    }
                });
            } else {
                console.log("Invalid data");
            }
        });
    }
    addUser(ws: WebSocket, message: Message) {
        this.users.push(new User(ws, message.email || "")); // update here
    }
    // handle authentication and exchange of messages
}
