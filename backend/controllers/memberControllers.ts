import { Request, Response } from "express";
import Chat_User from "../models/chat_users";
import User from "../models/users";
import mongoose from "mongoose";
import { CheckIfUserIdValid, CheckIfUserIsChatAdmin, CheckIfUserIsChatMember, GetUserIdFromEmail } from "../utils/user";
import Chat from "../models/chat";

export async function AddMember(req: Request, res: Response) {
  try {
    const { chat_id } = req.params
    const { email }: { email?: string } = req.body

    if (!chat_id || !email || !res.user) {
      return res.status(400).json({ msg: "Bad Request" })
    }

    const user_id = await GetUserIdFromEmail(email)
    if (!user_id) {
      return res.status(404).json({ msg: "Email not found" })
    }

    const isAdmin = await CheckIfUserIsChatAdmin(res.user._id.toString(), chat_id)
    if (!isAdmin)
      return res.status(403).json({ msg: "Only admins are allowed" }); //forbidden 

    const isAlreadyMember = await CheckIfUserIsChatMember(user_id, chat_id)
    if (isAlreadyMember)
      return res.status(409).json({ msg: "Already memeber" });

    // const isValidUserId = await CheckIfUserIdValid(user_id)
    // if (!isValidUserId)
    //   return res.status(406).json({ msg: "Invalid userid" });

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      await Promise.all([
        await Chat_User.create({
          chat_id,
          user_id,
          last_seen: Date.now()
        }),
        await Chat.findByIdAndUpdate(chat_id, {
          $inc: { num_members: 1 }
        })
      ])

      await session.commitTransaction()
      await session.endSession()

      return res.status(200).json({ msg: "Successfully added memeber" })
    } catch (err) {
      await session.abortTransaction()
      await session.endSession()
      return res.status(500).json({ msg: "Internal server error" })
    }
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error" })
  }
}

export async function GetMembers(req: Request, res: Response) {
  try {
    const { chat_id } = req.params
    const { limit = 10, skip = 0 }: { limit?: number, skip?: number } = req.query

    const members = await Chat_User.find({ chat_id }, { user_id: 1, last_seen: 1 }).limit(limit).skip(skip)

    const usersPromise = members.map(async ({ user_id, last_seen }) => {
      try {
        const user = await User.findById(user_id, { name: 1 })
        if (!user) {
          return undefined
        }
        return {
          ...user.toObject(),
          last_seen
        }
      } catch (err) {
        console.error("While getting user info", err)
        return null
      }
    })
    const users = await Promise.all(usersPromise)
    return users
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error" })
  }
}
