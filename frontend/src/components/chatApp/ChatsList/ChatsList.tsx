import axios from "axios"
import { useContext, useEffect } from "react"
import { ReactSortable } from "react-sortablejs"

import ChatSnippet from "./ChatsSnippet"
import AppContext from "../../../AppContext"
import { IChatSnippet } from "../../../types"


export default function ChatsList() {

  const { chatsList, setChatsList, setModals } = useContext(AppContext)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/c`, { withCredentials: true })
      .then(({ data }) => {
        if (data.chats) {
          setChatsList(data.chats.map((chatsSnippet: IChatSnippet) => {
            return { ...chatsSnippet, id: chatsSnippet._id }
          }))
        }
        // console.log(status, data)
      }).catch((err) => {
        console.error("While fetching chats", err)
      })
  }, [])

  return (
    <div className="w-[400px] bg-white">
      <div className="border-b border-r border-r-cyan-800 min-h-screen flex flex-col">

        <div className="w-full flex items-center py-2 px-4 justify-between bg-cyan-950">
          <div className="rounded-full bg-cyan-50 px-2.5 py-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>

          <button
            onClick={() => {
              setModals('new-chat')
            }}
            className="text-white flex items-center font-bold ">
            {/* <span className="text-xs bg-cyan-800 px-2 py-1.5 rounded-l-full">Create new Chat</span> */}
            <span className="p-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </span>
          </button>
        </div>
        <ReactSortable 
          disabled={true} 
          list={chatsList} 
          setList={setChatsList} >
          {
            chatsList.map((chatSnippet) => {
              return <ChatSnippet key={chatSnippet._id} chatSnippet={chatSnippet} setChatsList={setChatsList} />
            })
          }
        </ReactSortable>
      </div>
    </div>
  )
}