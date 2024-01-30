import { Request, Response } from "express"
import { CheckIfUserIsChatMember } from "../utils/user"
import Msg from "../models/msg"
import mongoose from "mongoose"
import Chat_User from "../models/chat_users"

export async function PostMsg(req: Request, res: Response) {
  try {
    const { chat_id } = req.params
    const { msg }: { msg: string } = req.body

    const checkIfUserIsMember = await CheckIfUserIsChatMember(res.user._id.toString(), chat_id)
    if (!checkIfUserIsMember)
      return res.status(403).json({ msg: "Not allowed to send message" });

    await Msg.create({
      chat_id,
      msg,
      time: Date.now(),
      author_id: res.user._id
    })
    return res.status(201).json({ msg: "Msg created" })
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error" })
  }
}

export async function GetMsgs(req: Request, res: Response) {
  try {
    const { chat_id } = req.params
    const { limit = 10, skip = 0 }: { limit?: number, skip?: number } = req.query

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const [msgs, _] = await Promise.all([
        await Msg.find({ chat_id })
          .sort({ time: 1 })
          .limit(limit)
          .skip(skip),
        await Chat_User.findOneAndUpdate({
          chat_id,
          user_id: res.user._id,
        },
          {
            last_seen: Date.now()
          })
      ])

      await session.commitTransaction()
      await session.endSession()

      return res.status(200).json({ msgs })
    } catch (err) {
      await session.abortTransaction()
      await session.endSession()
      return res.status(500).json({ msg: "Internal server error" })
    }
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error" })
  }
}

