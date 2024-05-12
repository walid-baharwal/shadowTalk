import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest } from "next/server";
import { z } from "zod";

const usernameSchemaValidation = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParams = { username: searchParams.get("username") };
    const result = usernameSchemaValidation.safeParse(queryParams);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0 ? usernameErrors.join(", ") : "Invalid query parameters",
        },
        { status: 405 }
      );
    }
    const { username } = result.data;
    const existingUser = await UserModel.findOne({ username, isVerified: true });
    if (existingUser) {
      return Response.json(
        {
          succes: false,
          message: "Username already exists",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        succes: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        succes: false,
        message: "Error checking username" + error.message,
      },
      { status: 500 }
    );
  }
}
