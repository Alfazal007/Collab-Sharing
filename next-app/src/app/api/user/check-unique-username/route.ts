import prisma from "@/db/db";
import { ApiResponse } from "@/utils/ApiResponse";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const params = {
        username: searchParams.get("username"),
    };
    const username = params.username;
    if (!username || username.length < 6 || username.length > 20) {
        return Response.json(
            new ApiResponse(200, "Invalid username provided", ""),
            {
                status: 200,
            }
        );
    }
    try {
        const userFromDB = await prisma.user.findFirst({
            where: {
                username,
            },
        });
        if (userFromDB) {
            return Response.json(
                new ApiResponse(200, "Invalid already exists", ""),
                {
                    status: 200,
                }
            );
        }
        return Response.json(
            new ApiResponse(200, "Username is available", ""),
            {
                status: 200,
            }
        );
    } catch (err) {
        return Response.json(
            new ApiResponse(500, "Issue talking to the database", ""),
            {
                status: 500,
            }
        );
    }
}
