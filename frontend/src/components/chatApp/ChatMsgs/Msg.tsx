import { useContext } from "react"
import { IMsg } from "../../../types"
import AppContext from "../../../AppContext"

export default function Msg({ msg, name }: { msg: IMsg, name?: string }) {
  const { user } = useContext(AppContext)
  const date = new Date(msg.time)
  // p-20 text-xl
  // px-4 py-2
  return <div className={`flex flex-col min-w-32 max-w-96 border px-4 py-2 shadow-lg relative ${(user?._id === msg.author_id) ? 'bg-cyan-900 text-white ml-auto' : 'ml-0 bg-white text-gray-800'} rounded-tl-none rounded-3xl`}>
    {
      name && user?._id != msg.author_id &&
      <span className="text-sm font-bold mb-2.5 text-cyan-700">{name}</span>
    }
    <p className="whitespace-pre-wrap">
      {
        msg.msg
      }
    </p>
    <div className={`flex mt-4 justify-between  ${(user?._id === msg.author_id) ? 'text-gray-300' : 'text-gray-700'}`}>
      <span className="text-[10px]">{`${date.getHours()}:${date.getMinutes()}`}</span>
      <span className="text-[10px]">{`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`}</span>
    </div>
  </div>
}