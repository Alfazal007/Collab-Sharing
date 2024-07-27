import { WebSocket } from "ws";

export class User {
    connection: WebSocket;
    email: String | null;
    isAuthenticated: boolean;

    constructor(
        conn: WebSocket,
        email: String,
        isAuthenticated: boolean = false
    ) {
        this.connection = conn;
        this.email = email;
        this.isAuthenticated = isAuthenticated;
    }
}
