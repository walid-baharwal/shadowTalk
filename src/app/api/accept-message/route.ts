import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User.model";

export async function POST(request: Request) {
  await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !session.user) {
        return Response.json(
            {
                succes: false,
                message: "Not authenticated",
            },
            { status: 400 }
        );
    }
    const { acceptMessage } = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            user._id,
            {
                isAcceptingMessage: acceptMessage,
            },
            { new: true }
        );
        if (!updatedUser) {
            return Response.json(
                {
                    succes: false,
                    message: "failed to update user accept message status",
                },
                { status: 400 }
            );
        }
        return Response.json(
            {
                succes: true,
                message: "status updated successfully",
                updatedUser,
            },
            { status: 200 }
        );
    } catch (error: any) {
        return Response.json(
            {
                succes: false,
                message: "error updating user accept message status" + error.message,
            },
            { status: 500 }
        );
    }
}
///
export async function GET(request: Request) {
   await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !session.user) {
        return Response.json(
            {
                succes: false,
                message: "Not authenticated",
            },
            { status: 400 }
        );
    }

    try {
        // const user = {
        //     _id:'6639dc780280df3455e3ad59',
        // }
        const foundUser = await UserModel.findById(user._id);
        if (!foundUser) {
            return Response.json(
                {
                    succes: false,
                    message: "failed to get user accept message status",
                },
                { status: 400 }
            );
        }
        return Response.json(
            {
                succes: true,
                message: "user status get successfully",
                isAcceptingMessage: foundUser.isAcceptingMessage,
            },
            { status: 200 }
        );
    } catch (error: any) {
        return Response.json(
            {
                succes: false,
                message: "error getting messages accept message status" + error.message,
            },
            { status: 500 }
        );
    }
}
