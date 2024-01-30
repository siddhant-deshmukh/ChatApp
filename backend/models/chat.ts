import mongoose, { Types } from "mongoose";

export interface IChatCreate {
  name: string,
  description: string
  admins: [Types.ObjectId]
  type: "group" | "personal"
  num_members: number
}
export interface IChat extends IChatCreate {
  _id: Types.ObjectId,
}

const chatSchema = new mongoose.Schema<IChat>({
  name: { type: String, required: true, maxLength: 30, minlength: 1 },
  description: { type: String, required: true, maxLength: 70, minlength: 1 },
  admins: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  type: { type: String, enum: ["group", "personal"], default: "group", required: true },
  num_members: { type: Number, required: true }
})

const Chat = mongoose.model<IChat>("Chat", chatSchema);
export default Chat;