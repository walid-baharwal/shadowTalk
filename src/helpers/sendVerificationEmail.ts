import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Shadow Talk <shadowtalk@resend.dev>",
      to: email,
      subject: "Shadow Talk | Verification Email",
      react: VerificationEmail({ username, verificationCode }),
    });
    return Promise.resolve({
      success: true,
      message: "Verification email sent successfully",
    });
    ///
  } catch (error) {
    console.log("Error sending verification email", error);
    return Promise.reject({
      success: false,
      message: "Verification email sending process failed",
    });
  }
}
