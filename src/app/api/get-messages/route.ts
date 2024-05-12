import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User.model";
import mongoose from "mongoose";

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
    const userMessages = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(user._id),
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);
    if (!userMessages || userMessages.length === 0) {
      return Response.json(
        {
          succes: false,
          message: "No messages yet",
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        succes: true,
        messages: userMessages[0].messages,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        succes: false,
        message: "error getting messages " + error.message,
      },
      { status: 500 }
    );
  }
}
