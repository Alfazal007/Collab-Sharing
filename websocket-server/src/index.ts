import { WebSocketServer } from "ws";
import { UserManager } from "./UserManager";
// import { decode } from "next-auth/jwt";

const wss = new WebSocketServer({ port: 8002 });
const userManager = UserManager.getInstance();

// async function verifyToken() {
//     const secret = "THISISANEXTAUTHSECRET";
//     const token =
//         "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..qex5PxHXpi0DC7_S.e5repaW5krQvbNJiAdx3zd6hWQiEf922k-Bx-A9tuxKmNRxcz_W1TX9ofPTI4PrQA49BT3OBdSsDqzTos3ykiF23aOzJSIQuWlLfDSN4T91rytxXBwEv8zLbuIoB3-Tf4JVZF0-5ll6weXgeqYOzSymcZL7ER_LUpZF3bqWCtEolPxwDaVq1_3Tze9_7qZgyxchb4OfOWlIHt9iCkpXWzEExlJyDgGLZSLRUQD2NkABQTc_WVwM_OguFmQfXuufT3WKQWi4GB4VKQA7BGZ4I7G5_3oquOL9pb6XIYrQ3AgB5Cdk137o2Ku-Ypsy5eA.6Q0kFlP4-FjackTA7Wo81Q";

//     try {
//         const data = await decode({
//             secret,
//             token,
//         });
//         console.log(data);
//     } catch (error) {
//         console.error("Invalid token:", error);
//         return null;
//     }
// }
// verifyToken();
// todo add the authentication layer

wss.on("connection", function connection(ws) {
    // ws.on("error", console.error); update to break off the connection
    userManager.addHandler(ws);

    // TODO:: REMOVE THIS PART
});

// first msg => connect to specific chat -> send the user informations -> email and password -> on connection -> validatae and establish the connection -> add user to this space -> chat exchanges
// user -> ws email
