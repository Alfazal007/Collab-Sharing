import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import prisma from "@/db/db";
import { isPasswordCorrect } from "@/utils/HashPassword";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },
            async authorize(credentials: any) {
                try {
                    const userFromDb = await prisma.user.findFirst({
                        where: {
                            email: credentials.email,
                        },
                    });
                    if (!userFromDb) {
                        return null;
                    }
                    const passwordSame = await isPasswordCorrect(
                        credentials.password,
                        userFromDb?.password
                    );
                    if (!passwordSame) {
                        return null;
                    }
                    return userFromDb;
                } catch (error) {
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXT_AUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id?.toString();
                token.username = user.username;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.username = token.username;
            }
            return session;
        },
        async signIn({ user, account, profile, email, credentials }) {
            if (account?.provider === "CREDENTIALS") {
                return true;
            }
            const dbUser = await prisma.user.findUnique({
                where: {
                    email: user?.email || "",
                },
            });

            if (dbUser) {
                return true;
            }
            try {
                await prisma.user.create({
                    data: {
                        name: user?.name || "",
                        username: user?.name || "",
                        email: user?.email || "",
                        password: "googleuser",
                        provider: "GOOGLE",
                    },
                });
            } catch (error: any) {
                return false;
            }
            return true;
        },
    },
};
