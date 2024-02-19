import { useContext, useState } from "react";
import { IMsg } from "../../../types";
import AppContext from "../../../AppContext";
import axios from "axios";

export default function NewChatMsg({ setMsgs }: {
  setMsgs: React.Dispatch<React.SetStateAction<IMsg[]>>
}) {
  const { selectedChat } = useContext(AppContext)
  const [newMsg, setNewMsg] = useState<string>("")

  function PostNewChat(selectedChat: string | null, msg: string) {
    if (!selectedChat) return;
    axios.post(`${import.meta.env.VITE_API_URL}/msg/${selectedChat}`, {
      msg
    }, { withCredentials: true })
      .then(({ data }) => {
        setMsgs((prev) => {
          return prev.slice().concat([data.msg])
        })
        // console.log(status, data)
        setNewMsg("")
      }).catch((err) => {
        console.error("While uploading message", err)
      })
  }

  return (
    <div className="flex bg-cyan-800 rounded-t-lg items-end space-x-3 w-full px-3 py-2">
      <textarea
        className="w-full rounded-lg"
        value={newMsg}
        rows={2}

        onChange={(e) => { setNewMsg(e.target.value) }}
      />
      <button
        onClick={() => { PostNewChat(selectedChat, newMsg) }}
        className="p-2 bg-cyan-100 text-cyan-800 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>
  )
}
