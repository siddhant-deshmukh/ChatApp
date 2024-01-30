import mongoose, { Types } from "mongoose";

export interface IChat_UserCreate {
  chat_id: Types.ObjectId
  user_id: Types.ObjectId
  last_seen: number
}
export interface IChat_User extends IChat_UserCreate {
  _id: Types.ObjectId,
}

const chat_UserSchema = new mongoose.Schema<IChat_User>({
  chat_id: { type: mongoose.SchemaTypes.ObjectId, ref: "Chat", index: true, required: true },
  user_id: { type: mongoose.SchemaTypes.ObjectId, ref: "User", index: true, required: true },
  last_seen: { type: Number, required: true },
})

const Chat_User = mongoose.model<IChat_User>("Chat_User", chat_UserSchema);
export default Chat_User;