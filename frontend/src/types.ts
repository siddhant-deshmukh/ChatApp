export interface IUserCreate {
  name: string
  email: string
  password: string
}
export interface IUser {
  _id: string
  name: string 
  email?: string
}
export interface IMember {
  _id: string
  name: string
  last_seen: number
}

export interface IChatCreate {
  name: string
  description: string
}
export interface IChatSnippet {
  id: string
  _id: string
  name: string
}
export interface IChat extends IChatCreate {
  admins: [string]
  type: "group" | "personal"
  num_members: number
  num_msgs: number
}


export interface IMsg {
  _id: string
  msg: string
  time: number
  chat_id: string
  author_id: string
}

export interface IChatContent {
  msgs: IMsg[]
}

