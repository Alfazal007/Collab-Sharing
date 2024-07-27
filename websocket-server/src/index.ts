import { WebSocketServer } from "ws";
import { UserManager } from "./UserManager";
import { configDotenv } from "dotenv";
configDotenv();
// import { decode } from "next-auth/jwt";

const wss = new WebSocketServer({ port: 8002 });
const userManager = UserManager.getInstance();

wss.on("connection", function connection(ws) {
    // ws.on("error", console.error); update to break off the connection
    userManager.addHandler(ws);

    // TODO:: add disconnecting logic upon which user gets removed from the map object
});

// first msg => connect to specific chat -> send the user informations -> email and password -> on connection -> validatae and establish the connection -> add user to this space -> chat exchanges
// user -> ws email
