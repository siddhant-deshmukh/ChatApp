import { Request, Response } from "express";
import Chat from "../models/chat";
import Chat_User from "../models/chat_users";
import mongoose from "mongoose";
import { CheckIfUserIsChatMember } from "../utils/user";

export async function GetChatDetails(req: Request, res: Response) {
  try {
    const { chat_id } = req.params

    const checkIfUserIsMember = await CheckIfUserIsChatMember(res.user._id.toString(), chat_id)
    if (!checkIfUserIsMember)
      return res.status(403).json({ msg: "Not allowed to send message" });

    const chat = await Chat.findById(chat_id)
    if (!chat)
      return res.status(404).json({ msg: "Wrong chat_id" })

    return res.status(200).json({ chat })
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error" })
  }
}

export async function CreateChat(req: Request, res: Response) {
  try {
    const { name, description, type }: { name?: string, description?: string, type?: string } = req.body
    if (!name || !description || !type || !res.user) {
      return res.status(400).json({ msg: "Bad Request" })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const chat = await Chat.create({
        admins: [res.user._id],
        name,
        description,
        type,
        num_members: 1
      })
      await Chat_User.create({
        user_id: res.user._id,
        chat_id: chat._id,
        last_seen: Date.now()
      })

      await session.commitTransaction()
      await session.endSession()

      return res.status(201).json({ chat: chat.toObject() })
    } catch (err) {
      await session.abortTransaction()
      await session.endSession()
      return res.status(500).json({ msg: "Internal server error" })
    }

  } catch (err) {
    return res.status(500).json({ msg: "Internal server error" })
  }
}

export async function GetUserChats(req: Request, res: Response) {
  try {
    const { limit = 10, skip = 0 }: { limit?: number, skip?: number } = req.query

    if (!limit || skip === undefined || !res.user) {
      return res.status(400).json({ msg: "Bad Request" })
    }


    const chatIds = await Chat_User.find({ user_id: res.user._id })
      .sort({ last_seen: -1 })
      .limit(limit)
      .skip(skip)

    const chats = await Promise.all(
      chatIds.map(async ({ chat_id }) => {
        const chat = await Chat.findById(chat_id).select({ name: 1 })
        return chat?.toObject()
      })
    )
    return res.status(200).json({ chats })
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error" })
  }
}

export async function UpdateChatAdmins(req: Request, res: Response) {
  try {

  } catch (err) {
    return res.status(500).json({ msg: "Internal server error" })
  }
}

export async function UpdateChatInfo(req: Request, res: Response) {
  try {

  } catch (err) {
    return res.status(500).json({ msg: "Internal server error" })
  }
}
