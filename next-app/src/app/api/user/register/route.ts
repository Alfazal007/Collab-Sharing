import prisma from "@/db/db";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { hashPassword } from "@/utils/HashPassword";
import { registerUserType, ZodError } from "@/zodTypes/registerUserType";

export async function POST(request: Request) {
    try {
        // handle the zod errors
        const body = await request.json();
        const result = registerUserType.safeParse(body);
        if (!result.success) {
            const zodErrors: ZodError[] = [];
            result.error.errors.map((err) => {
                const errPath = err.path[0];
                const errMsg = err.message;
                zodErrors.push({ [errPath]: errMsg });
            });
            return Response.json(
                new ApiError(400, "Invalid object", [], zodErrors),
                {
                    status: 400,
                }
            );
        }
        // communicate with the database to check for uniqueness
        try {
            const user = await prisma.user.findFirst({
                where: {
                    email: result.data.email,
                },
            });
            if (user) {
                return Response.json(
                    new ApiResponse(400, "User with similar email exists", []),
                    { status: 400 }
                );
            }
        } catch (err) {
            return Response.json(
                new ApiError(400, "Error talking to the database", [], {}),
                {
                    status: 400,
                }
            );
        }

        const hashedPassword = await hashPassword(result.data.password);
        // add new entry to the database
        try {
            const newUser = await prisma.user.create({
                data: {
                    email: result.data.email,
                    username: result.data.username,
                    password: hashedPassword,
                    provider: "CREDENTIALS",
                    name: result.data.username,
                },
                select: {
                    email: true,
                    id: true,
                    username: true,
                },
            });
            if (!newUser) {
                return Response.json(
                    new ApiError(400, "Issue creating new user", [], {}),
                    {
                        status: 400,
                    }
                );
            }
            return Response.json(
                new ApiResponse(201, "New User created successfully", newUser),
                {
                    status: 201,
                }
            );
        } catch (err) {
            return Response.json(
                new ApiError(400, "Error talking to the database", [], {}),
                {
                    status: 400,
                }
            );
        }
    } catch (error: any) {
        return Response.json(
            new ApiError(400, "Error talking to the database", [], {}),
            {
                status: 400,
            }
        );
    }
}
