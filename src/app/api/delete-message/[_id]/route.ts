import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { getServerSession, User } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(request: NextRequest, { params }: { params: { _id: string } }) {
  await dbConnect();
  try {
    const _id = params._id;
    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!user || !session) {
      return Response.json({ success: false, message: "Not authenticated" }, { status: 400 });
    }

    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: _id } } }
    );
    console.log(updateResult);
    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { message: "Message not found or already deleted", success: false },
        { status: 404 }
      );
    }
    return Response.json({ message: "Message deleted", success: true }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Error deleting message", success: false }, { status: 500 });
  }
}
