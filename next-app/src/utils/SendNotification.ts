import { getClient } from "./Redis";

export async function sendNotifications(
    community: string,
    link: string,
    to: { [key: string]: string }[]
) {
    if (to.length == 0) {
        return;
    }
    let allReceivers: string[] = [];
    to.forEach((receiver) => {
        allReceivers.push(receiver["email"]);
    });
    const client = await getClient();
    if (client == null) {
        return;
    } else {
        await client.lPush(
            "worker",
            JSON.stringify({
                link: link,
                type: "notification",
                community: community,
                to: allReceivers,
            })
        );
    }
}
