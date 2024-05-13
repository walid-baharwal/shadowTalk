import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const messageSchema: Schema<Message> = new Schema(
  {
    content: {
      type: String,
      required: [true, " Message is required"],
    },
  },
  { timestamps: true }
);

const MessageModel =
  (mongoose.models.Message as mongoose.Model<Message>) ||
  mongoose.model<Message>("Message", messageSchema);

export default MessageModel;
