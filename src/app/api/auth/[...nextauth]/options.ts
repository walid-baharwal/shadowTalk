    import dbConnect from "@/lib/dbConnect";
    import UserModel from "@/models/User.model";
    import Credentials from "next-auth/providers/credentials";
    import { NextAuthOptions } from "next-auth";

    export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
        id: "credentials",
        name: "Credentials",
        credentials: {
            username:{label: "Username"},
            email: { label: "Email" },
            password: { label: "Password", type: "password" },
        },

        async authorize(credentials: any): Promise<any> {
           await dbConnect();
            try {
            const user = await UserModel.findOne({
                $or: [{ email: credentials.identifier }, { username: credentials.identifier }],
            });
            if (!user) {
                throw new Error("User with this credential not found");
            }
            if (!user.isVerified) {
                throw new Error("Please verify your account before logging in");
            }
            const isPasswordCorrect = await user.isPasswordCorrect(credentials.password);
            if (isPasswordCorrect) {
                return user;
            } else {
                throw new Error("Please login using correct credentials");
            }
            } catch (error: any) {
            throw new Error(error.message);
            }
        },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
        if (user) {
            token._id = user._id?.toString();
            token.username = user.username;
            token.isVerified = user.isVerified;
            token.isAcceptingMessage = user.isAcceptingMessage;
        }
        return token;
    },
    async session({ session, token }) {
        if (token) {
            session.user._id = token._id;
            session.user.username = token.username;
            session.user.isVerified = token.isVerified;
            session.user.isAcceptingMessage = token.isAcceptingMessage;
        }
            //console.log("session -->" , session);
        return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/sign-in",
    },
    };
