import prisma from "@/db/db";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return Response.json(
            new ApiError(400, "No user found try logging in again", [], []),
            { status: 400 }
        );
    }
    const { searchParams } = new URL(request.url);
    const params = {
        community: searchParams.get("community"),
    };
    const community = params.community;
    if (!community || community.length < 3 || community.length > 20) {
        return Response.json(new ApiError(400, "Invalid community", [], []), {
            status: 400,
        });
    }
    try {
        const communityFollowers = await prisma.community.findFirst({
            where: {
                name: community,
            },
            select: {
                members: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                name: true,
                id: true,
            },
        });
        if (!communityFollowers) {
            return Response.json(
                new ApiError(400, "Community not found", [], []),
                {
                    status: 400,
                }
            );
        }
        // check if already exists
        const isUserMember = communityFollowers.members.some(
            (member) => member.id == session.user.id
        );
        if (isUserMember) {
            try {
                const leaveCommunity = await prisma.community.update({
                    where: {
                        id: communityFollowers.id,
                    },
                    data: {
                        members: {
                            disconnect: {
                                id: session.user.id,
                            },
                        },
                    },
                });
                return Response.json(
                    new ApiResponse(200, "Left the community", ""),
                    {
                        status: 200,
                    }
                );
            } catch (err) {
                return Response.json(
                    new ApiError(400, "Issue talking to the database", [], []),
                    {
                        status: 400,
                    }
                );
            }
        }
        return Response.json(
            new ApiResponse(200, "Not part of the community", ""),
            {
                status: 200,
            }
        );
    } catch (err) {
        return Response.json(
            new ApiError(500, "Issue talking to the database", [], []),
            {
                status: 500,
            }
        );
    }
}
