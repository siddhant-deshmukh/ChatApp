import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { IChat, IMsg } from "../../../types";
import AppContext from "../../../AppContext";
import axios from "axios";

const msgLimit = 10

export default function ChatMsgs() {

  const msgsCountRef = useRef<number>(0)
  const newMsgNone = useRef<boolean>(false)
  const totalMsgsCountRef = useRef<number>(0)
  const newMsgsLoadingRef = useRef<boolean>(false)

  const chatListPrevHeightRef = useRef<number | null>(null)
  const chatMsgListRef = useRef<HTMLDivElement | null>(null)
  const chatListTopElemRef = useRef<HTMLDivElement | null>(null)
  const chatMsgListContainerRef = useRef<HTMLDivElement | null>(null)

  const [msgs, setMsgs] = useState<IMsg[]>([])
  const { selectedChat } = useContext(AppContext)

  const chatIdRef = useRef("")
  const [chatInfo, setChatInfo] = useState<IChat | null>(null)


  const fetchMsgs = useCallback((selectedChat: string) => {
    if (newMsgsLoadingRef.current || !chatMsgListRef.current) {
      console.log(chatMsgListRef.current, "Is chatMsgListRef component mounted?")
      console.log(newMsgsLoadingRef, "new messageing is still fetching")
      return
    }
    newMsgsLoadingRef.current = true
    chatListPrevHeightRef.current = chatMsgListRef.current.offsetHeight
    // console.log("fetching new messages", chatListPrevHeightRef.current, chatMsgListContainerRef.current)
    axios.get(`${import.meta.env.VITE_API_URL}/msg/${selectedChat}?limit=${msgLimit}&nmsgs=${totalMsgsCountRef.current}&skip=${msgsCountRef.current}`, { withCredentials: true })
      .then(({ status, data}: { status: number,  data:{ msgs?: IMsg[] } }) => {
        if ( data.msgs && Array.isArray(data.msgs)) {
          data.msgs.reverse()
          console.log("after fetching msgs", status, data.msgs)

          setMsgs((prev) => {
            if(!data.msgs) return prev.slice();
            if (msgsCountRef.current === 0) //chat changed
              return data.msgs;
            return data.msgs.concat(prev.slice())
          })
          msgsCountRef.current += data.msgs.length
          console.log("Message length", msgsCountRef.current, data.msgs)
        } else {
          console.log("after fetching msgs", status, data)
        }

      }).catch((err) => {
        console.error("error after fetching msgs", err)
      }).finally(() => {
        newMsgsLoadingRef.current = false
      })
  }, [setMsgs, msgsCountRef, totalMsgsCountRef, newMsgsLoadingRef, chatMsgListRef, chatMsgListContainerRef])

  const atTopTriggerCallback = useCallback((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    if (entries[0].isIntersecting) {
      if (selectedChat) {
        console.log("triggered!")
        fetchMsgs(selectedChat)
      }
    }
  }, [fetchMsgs, selectedChat])

  const handleSelectedChatIdChanged = useCallback((selectedChat: string) => {
    newMsgsLoadingRef.current = true
    axios.get(`${import.meta.env.VITE_API_URL}/c/${selectedChat}`, { withCredentials: true })
      .then(({ data }) => {
        // console.log(status, data)
        if (data.chat as IChat) {
          msgsCountRef.current = 0
          totalMsgsCountRef.current = data.chat.num_msgs
          setChatInfo(data.chat)
          newMsgsLoadingRef.current = false
          console.log("feching new messages for change in chatid")
          fetchMsgs(selectedChat)
        }
      }).catch((err) => {
        console.error("While getting chat details", selectedChat, err)
      }).finally(() => {
        newMsgsLoadingRef.current = false
      })
  }, [msgsCountRef, totalMsgsCountRef, newMsgsLoadingRef, fetchMsgs, setChatInfo])

  useEffect(() => {
    // selectedChat have changed the value
    if (selectedChat && chatIdRef.current != selectedChat) {
      // getting the chat info
      handleSelectedChatIdChanged(selectedChat)
    }

    if (chatListTopElemRef.current) {
      let observer = new IntersectionObserver(atTopTriggerCallback)
      observer.observe(chatListTopElemRef.current)
    }

    chatIdRef.current = selectedChat ? selectedChat : ""
  }, [selectedChat, fetchMsgs, setChatInfo])

  // useEffect(() => {

  //   if (selectedChat) {
  //     fetchMsgs()
  //   }
  // }, [selectedChat, fetchMsgs])

  return (
    <div className="flex flex-col h-full w-full">
      <div>{JSON.stringify(chatInfo, null)}</div>
      <ChatMsgList
        msgs={msgs}
        chatListTopElemRef={chatListTopElemRef}
        chatListPrevHeightRef={chatListPrevHeightRef}
        chatMsgListRef={chatMsgListRef}
        chatMsgListContainerRef={chatMsgListContainerRef}
      />
      <NewChat setMsgs={setMsgs} />
    </div>
  )
}

function ChatMsgList({ msgs, chatMsgListRef, chatMsgListContainerRef, chatListPrevHeightRef, chatListTopElemRef }: {
  msgs: IMsg[],
  chatListPrevHeightRef: React.MutableRefObject<number | null>
  chatListTopElemRef: React.MutableRefObject<HTMLDivElement | null>
  chatMsgListRef: React.MutableRefObject<HTMLDivElement | null>
  chatMsgListContainerRef: React.MutableRefObject<HTMLDivElement | null>
}) {


  useEffect(() => {
    if (chatMsgListContainerRef.current && chatMsgListRef.current && chatListPrevHeightRef.current != null) {
      let scrollBy = chatMsgListRef.current.offsetHeight - chatListPrevHeightRef.current
      console.log("msgs changed", msgs, "getting ready to scroll", "Scroll to", scrollBy)
      chatMsgListContainerRef.current.scrollBy({ top: scrollBy, left: 0, behavior: 'instant' })
    } else {
      console.log("msgs changed", msgs, "getting ready to scroll", "failed!", chatMsgListContainerRef.current, chatMsgListRef.current, chatListPrevHeightRef.current)
    }
  }, [msgs])

  return (
    <div ref={chatMsgListContainerRef} className="h-full bg-cyan-100 px-5  overflow-y-auto">
      <div ref={chatListTopElemRef}></div>
      <div ref={chatMsgListRef} className="flex flex-col space-y-5 ">
        {
          msgs.map((msg, index) => {
            return (
              <Msg key={msg._id} msg={msg} />
            )
          })
        }
      </div>
    </div>
  )
}

function NewChat({ setMsgs }: {
  setMsgs: React.Dispatch<React.SetStateAction<IMsg[]>>
}) {
  const { selectedChat } = useContext(AppContext)
  const [newMsg, setNewMsg] = useState<string>("")

  return (
    <div className="flex bg-gray-300 items-end space-x-3 w-full px-5 py-2">
      <textarea
        className="w-full"
        value={newMsg}
        onChange={(e) => { setNewMsg(e.target.value) }}
      />
      <button
        onClick={() => {
          axios.post(`${import.meta.env.VITE_API_URL}/msg/${selectedChat}`, {
            msg: newMsg
          }, { withCredentials: true })
            .then(({ status, data }) => {
              setMsgs((prev) => {
                return prev.slice().concat([data.msg])
              })
              console.log(status, data)
              setNewMsg("")
            }).catch((err) => {
              console.error("While uploading message", err)
            })
        }}
        className="p-2 bg-cyan-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>
  )
}
function Msg({ msg }: { msg: IMsg }) {
  const { user } = useContext(AppContext)
  const date = new Date(msg.time)
  // p-20 text-xl
  // px-4 py-2
  return <div className={`max-w-96 border px-4 py-2 shadow-lg relative ${(user?._id === msg.author_id) ? 'bg-cyan-900 text-white ml-auto' : 'ml-0 bg-white text-gray-800'} rounded-lg `}>
    <p>
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