"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(conn, email) {
        this.connection = conn;
        this.email = email;
        this.isAuthenticated = true;
    }
}
exports.User = User;
