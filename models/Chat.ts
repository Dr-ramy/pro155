import mongoose, { Document, Model, Schema } from "mongoose";

export interface IChatMessage extends Document {
  username: string;
  content: string;
  createdAt: Date;
}

const ChatSchema = new Schema<IChatMessage>({
  username: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Chat: Model<IChatMessage> = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);

export default Chat;
