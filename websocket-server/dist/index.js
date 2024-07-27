"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const UserManager_1 = require("./UserManager");
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
// import { decode } from "next-auth/jwt";
const wss = new ws_1.WebSocketServer({ port: 8002 });
const userManager = UserManager_1.UserManager.getInstance();
wss.on("connection", function connection(ws) {
    // ws.on("error", console.error); update to break off the connection
    userManager.addHandler(ws);
    // TODO:: add disconnecting logic upon which user gets removed from the map object
});
// first msg => connect to specific chat -> send the user informations -> email and password -> on connection -> validatae and establish the connection -> add user to this space -> chat exchanges
// user -> ws email
