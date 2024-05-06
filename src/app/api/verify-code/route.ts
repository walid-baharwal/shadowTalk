import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";

export async function POST(request: Request) {
    dbConnect();
    try {
        const { username, verificationCode } = await request.json();
        if (!username || !verificationCode) {
            return Response.json(
                {
                    success: false,
                    message: `Fields cannot be empty`,
                },
                { status: 400 }
            );
        }   

        const user = await UserModel.findOne({
            username,
            verificationCode,
            verificationCodeExpiry: { $gt: Date.now() },
        });
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid verification code or expired",
                },
                { status: 400 }
            );
        }
        user.isVerified = true;
        await user.save();
        return Response.json(
            {
                success: true,
                message: "Verified successfully",
            },
            { status: 200 }
        );
    } catch (error: any) {
        return Response.json(
            {
                success: false,
                message: "Error processing verify code request" + error.message,
            },
            { status: 500 }
        );
    }
}
