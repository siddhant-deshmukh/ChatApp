import { useContext, useEffect, useState } from "react"
import { IChatSnippet } from "../../../types"
import axios from "axios"
import AppContext from "../../../AppContext"

export default function ChatsList() {

  const [chatsList, setChatsList] = useState<IChatSnippet[]>([])

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/c`, { withCredentials: true })
      .then(({ status, data }) => {
        if (data.chats) {
          setChatsList(data.chats)
        }
        // console.log(status, data)
      }).catch((err) => {
        console.error("While fetching chats", err)
      })
  }, [])

  return (
    <div className="w-[400px] p-2">
      <div className="border-b flex flex-col">
        {
          chatsList.map((chatSnippet) => {
            return <ChatSnippet key={chatSnippet._id} chatSnippet={chatSnippet} />
          })
        }
      </div>
    </div>
  )
}

function ChatSnippet({ chatSnippet }: { chatSnippet: IChatSnippet }) {
  const { setSelectedChat } = useContext(AppContext)

  return (
    <button
      onClick={() => { setSelectedChat(chatSnippet._id) }}
      className="flex w-full items-center space-x-3 px-3 py-2 border-t border-x bg-white hover:bg-gray-100">
      <div className="flex items-center justify-center border text-gray-500 bg-gray-50 px-6 text-3xl font-extrabold rounded-full w-6 aspect-square">
        <span>
          {chatSnippet.name[0].toUpperCase()}
        </span>
      </div>
      <div className="text-sm font-semibold">
        <span>{chatSnippet.name}</span>
      </div>
    </button>
  )
}