import Chat, { IChat } from "../models/chat";
import Chat_User from "../models/chat_users";
import User from "../models/users";

export async function CheckIfUserIsChatAdmin(user_id: string, chat_id: string, chat?: IChat) {
  try {
    if (chat) {
      if (chat.admins.find((_id) => _id.toString() === user_id))
        return true;
      else
        return false;
    } else {
      const theChat = await Chat.findById(chat_id, { admins: 1 })
      if (!theChat) {
        return undefined
      } else {
        if (theChat.admins.find((_id) => _id.toString() === user_id))
          return true;
        else
          return false;
      }
    }
  } catch (err) {
    console.error("While checking is user is admin", err)
    return null
  }
}

export async function CheckIfUserIsChatMember(user_id: string, chat_id: string) {
  try {
    const theMember = await Chat_User.findOne({ user_id, chat_id })
    if (theMember)
      return true;
    else
      return false;
  } catch (err) {
    console.error("While checking is user is chat member", err)
    return null
  }
}

export async function CheckIfUserIdValid(user_id: string) {
  try {
    const theUser = await User.findById(user_id)
    if (theUser)
      return true;
    else
      return false;
  } catch (err) {
    console.error("While checking is user is chat member", err)
    return null
  }
}

export async function GetUserIdFromEmail(email: string) {
  try {
    const theUser = await User.findOne({ email }, { password: 0 })
    if (theUser)
      return theUser._id.toString();
    else
      return false;
  } catch (err) {
    console.error("While checking is user is chat member", err)
    return null
  }
}