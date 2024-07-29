import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiError } from "@/utils/ApiError";
import prisma from "@/db/db";
import { ApiResponse } from "@/utils/ApiResponse";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return Response.json(
            new ApiError(400, "No user found try logging in again", [], []),
            { status: 400 }
        );
    }
    try {
        const messages = await prisma.message.findMany({
            where: {
                toUserId: session.user.id,
            },
        });
        await prisma.message.deleteMany({
            where: {
                toUserId: session.user.id,
            },
        });
        return Response.json(
            new ApiResponse(200, "Received messages", messages),
            {
                status: 200,
            }
        );
    } catch (err) {
        return Response.json(
            new ApiError(400, "Issue getting the data", [], []),
            {
                status: 400,
            }
        );
    }
}
