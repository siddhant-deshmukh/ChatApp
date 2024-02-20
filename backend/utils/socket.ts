import * as jwt from 'jsonwebtoken'
import Chat_User from '../models/chat_users'

export function CheckJWTCookie(cookie: string | undefined) {
  try {
    if (cookie) {
      const pairs = cookie.split(";")
      let access_token
      pairs.forEach((pair) => {
        const splitted = pair.split("=")
        if (splitted.length >= 2 && splitted[0].trim() === "access_token") {
          access_token = splitted[1].trim() as string
        }
      })
      if (access_token) {
        const decoded = jwt.verify(access_token, process.env.TOKEN_KEY || 'zhingalala');
        if (typeof decoded != 'string' && decoded._id) {
          return decoded._id as string
        }
      }
    }
  } catch (err) {

  }
}

export async function CheckIfUserisChatMember(chat_id: string, user_id: string) {
  try {
    const member = await Chat_User.exists({ user_id, chat_id })
    if (!member) return false;
    return true
  } catch (err) {
    return false
  }
}