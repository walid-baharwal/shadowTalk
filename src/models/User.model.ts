    import mongoose, { Schema, Document } from "mongoose";
    import { Message, messageSchema } from "./Message.model";
    import bcrypt from "bcryptjs";

    export interface User extends Document {
        username: string;
        email: string;
        password: string;
        verificationCode: string;
        verificationCodeExpiry: Date;
        isVerified: boolean;
        isAcceptingMessage: boolean;
        messages: Message[];
        isPasswordCorrect: (password: string) => Promise<boolean>;
    }

    const userSchema: Schema<User> = new Schema(
        {
            username: {
                type: String,
                required: [true, "Username is required"],
                unique: true,
                trim: true,
                lowercase: true,
            },
            email: {
                type: String,
                required: [true, "Email is required"],
                unique: true,
                lowercase: true,
                match: [/.+\@.+\..+/, "Please use a valid email address"],
            },
            password: {
                type: String,
                required: [true, "Password is required"],
            },
            verificationCode: {
                type: String,
                required: [true, "Verification key is required"],
            },
            verificationCodeExpiry: {
                type: Date,
                required: [true, "Verification key Expiry is required"],
            },
            isVerified: {
                type: Boolean,
                default: false,
            },
            isAcceptingMessage: {
                type: Boolean,
                default: true,
            },
            messages: [messageSchema],
        },
        { timestamps: true }
    );

    userSchema.pre("save", async function (next) {
        if (!this.isModified("password")) return next();
        this.password = await bcrypt.hash(this.password, 10);
        next();
    });

    userSchema.methods.isPasswordCorrect = async function (
        this: User,
        password: string
    ): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    };

    const UserModel =
        (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema);

    export default UserModel;
