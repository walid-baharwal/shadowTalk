import mongoose, { Schema, Document, mongo } from "mongoose";

export interface Message extends Document {
  content: string;
}

export const messageSchema: Schema<Message> = new Schema(
  {
    content:{
        type: String,
        required: [true," Message is required"]
    }
  },
  { timestamps: true }
);

const MessageModel =
  (mongoose.models.Message as mongoose.Model<Message>) ||
  mongoose.model<Message>("Message", messageSchema);

export default MessageModel;
