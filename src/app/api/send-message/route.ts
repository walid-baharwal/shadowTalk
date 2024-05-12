import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { Message } from "@/models/Message.model";

export async function POST(request: Request) {
   await dbConnect();
    try {
        const { username, content } = await request.json();

        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 400 }
            );
        }
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting messages",
                },
                { status: 400 }
            );
        }

        user.messages.push({ content } as Message);
        await user.save();

        return Response.json(
            {
                success: true,
                message: "Message has been sent successfully",
            },
            { status: 200 }
        );
    } catch (error: any) {
        return Response.json(
            {
                succes: false,
                message: "error sending message" + error.message,
            },
            { status: 500 }
        );
    }
}
