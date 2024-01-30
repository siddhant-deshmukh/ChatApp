import mongoose, { Types } from "mongoose";

export interface IMsgCreate {
  chat_id: Types.ObjectId
  author_id: Types.ObjectId
  msg: string
  time: number
}
export interface IMsg extends IMsgCreate {
  _id: Types.ObjectId,
}

const msgSchema = new mongoose.Schema<IMsg>({
  author_id: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true, index: true },
  chat_id: { type: mongoose.SchemaTypes.ObjectId, ref: "Chat", required: true, index: true },
  msg: { type: String, maxLength: 200, minlength: 1, required: true },
  time: { type: Number, required: true },
})

const Msg = mongoose.model<IMsg>("Msg", msgSchema);
export default Msg;