import axios from "axios";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import NewChat from "./NewChatMsg";
import ChatMsgList from "./ChatMsgsList";
import { IChat, IMember, IMsg } from "../../../types";
import AppContext from "../../../AppContext";
import SelectedChatInfo from "./SelectedChatInfo";
import MemberModal from "./MemberModal";

const msgLimit = 10

export default function ChatMsgs() {

  // fetching new msgs ref
  const msgsCountRef = useRef<number>(0) //fold value of total msgs in list
  const totalMsgsCountRef = useRef<number>(0) //total messages in the whole chat(not necessarily in list) ( this will be later used to refrance the current state of frontend )
  const newMsgNoneRef = useRef<boolean>(false) //to tell that no new msgs are left to see
  const newMsgsLoadingRef = useRef<boolean>(false) //if is currently fetching new messages or chat info or not
  // chat list related ref 
  const chatListPrevHeightRef = useRef<number | null>(null) // previsour height of chatList
  const chatMsgListRef = useRef<HTMLDivElement | null>(null) // ref to chatMsgList. //* used to controll scroll of the list e.g going at bottom, stayling at the same position
  const chatListTopElemRef = useRef<HTMLDivElement | null>(null) // ref to element top of list //* used to check if user is at the top of list so that we can fetch new msgs 
  const chatListUpdateTypeRef = useRef<null | 'upward' | 'backword'>(null) //depending upon how new elements are inserted in list

  const chatIdRef = useRef("") //to check if the chatId selected is changed

  const [msgs, setMsgs] = useState<IMsg[]>([])
  const { selectedChat } = useContext(AppContext)
  const [modal, setModal] = useState<boolean>(false)
  const [msgLoding, setMsgLoding] = useState<boolean>(false)
  const [chatInfo, setChatInfo] = useState<IChat | null>(null)
  const [chatMembersInfo, setChatMembersInfo] = useState<Map<string, IMember>>(new Map())


  const fetchMsgs = useCallback((selectedChat: string) => {
    if (newMsgNoneRef.current === true || newMsgsLoadingRef.current || !chatMsgListRef.current) {
      // console.log("will not fetch msg")
      // console.log(chatMsgListRef.current, "Is chatMsgListRef component mounted?")
      // console.log(newMsgsLoadingRef, "new messageing is still fetching")
      return
    }
    newMsgsLoadingRef.current = true
    setMsgLoding(true)
    chatListPrevHeightRef.current = chatMsgListRef.current.offsetHeight
    axios.get(`${import.meta.env.VITE_API_URL}/msg/${selectedChat}?limit=${msgLimit}&nmsgs=${totalMsgsCountRef.current}&skip=${msgsCountRef.current}`, { withCredentials: true })
      .then(({ status, data }: { status: number, data: { msgs?: IMsg[] } }) => {
        if (data.msgs && Array.isArray(data.msgs)) {
          data.msgs.reverse()
          // console.log("after fetching msgs", status, data.msgs)
          if (data.msgs.length === 0) { //* no new messages
            newMsgNoneRef.current = true
          }
          setMsgs((prev) => {
            if (!data.msgs) return prev.slice();
            if (msgsCountRef.current === 0) //chat changed
              return data.msgs;
            return data.msgs.concat(prev.slice())
          })
          msgsCountRef.current += data.msgs.length
          // console.log("Message length", msgsCountRef.current, data.msgs)
          chatListUpdateTypeRef.current = 'upward'
        } else {
          console.log("after fetching msgs", status, data)
        }

      }).catch((err) => {
        console.error("error after fetching msgs", err)
      }).finally(() => {
        setMsgLoding(false)
        newMsgsLoadingRef.current = false
      })
  }, [setMsgs, setMsgLoding, msgsCountRef, totalMsgsCountRef, newMsgsLoadingRef, chatMsgListRef])

  const atTopTriggerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting) {
      if (selectedChat) {
        console.log("triggered!")
        fetchMsgs(selectedChat)
      }
    }
  }, [fetchMsgs, selectedChat])

  const handleSelectedChatIdChanged = useCallback((selectedChat: string) => {
    newMsgsLoadingRef.current = true
    setMsgLoding(true)
    setMsgs([])
    axios.get(`${import.meta.env.VITE_API_URL}/c/${selectedChat}`, { withCredentials: true })
      .then(({ data }) => {
        // console.log(status, data)
        if (data.chat as IChat) {
          msgsCountRef.current = 0
          newMsgNoneRef.current = false
          newMsgsLoadingRef.current = false
          totalMsgsCountRef.current = data.chat.num_msgs

          setChatInfo(data.chat)
          setMsgLoding(false)
          // console.log("feching new messages for change in chatid")
          fetchMsgs(selectedChat)
        }
      }).catch((err) => {
        console.error("While getting chat details", selectedChat, err)
      }).finally(() => {
        newMsgsLoadingRef.current = false
        setMsgLoding(false)
      })
  }, [msgsCountRef, totalMsgsCountRef, newMsgsLoadingRef, fetchMsgs, setChatInfo, setMsgLoding])

  useEffect(() => {
    // selectedChat have changed the value
    if (selectedChat && chatIdRef.current != selectedChat) {
      // getting the chat info
      handleSelectedChatIdChanged(selectedChat)
    }

    var observer: IntersectionObserver | undefined
    if (chatListTopElemRef.current) {
      observer = new IntersectionObserver(atTopTriggerCallback)
      observer.observe(chatListTopElemRef.current)
    }

    chatIdRef.current = selectedChat ? selectedChat : ""
    return () => {
      if (chatListTopElemRef.current)
        observer?.unobserve(chatListTopElemRef.current);
    }
  }, [selectedChat, fetchMsgs, setChatInfo])

  return (
    <div className={`flex relative flex-col h-full w-full ${!modal?'pr-0':'pr-0 xl:pr-[380px]'}`}>
      <SelectedChatInfo chatInfo={chatInfo} setModal={setModal} />
      <ChatMsgList
        msgs={msgs}
        msgLoding={msgLoding}
        chatMembersInfo={chatMembersInfo}
        chatListTopElemRef={chatListTopElemRef}
        chatListPrevHeightRef={chatListPrevHeightRef}
        chatMsgListRef={chatMsgListRef}
        chatListUpdateTypeRef={chatListUpdateTypeRef}
      />
      <div className={`absolute z-10 ${modal?'block':'hidden'} top-0 right-0 w-full xl:w-auto h-full`}>
        <MemberModal 
          chatInfo={chatInfo} chatIdRef={chatIdRef}
          selectedChat={selectedChat} setModal={setModal}
          chatMembersInfo={chatMembersInfo} setChatMembersInfo={setChatMembersInfo} />
      </div>
      <NewChat setMsgs={setMsgs} />
    </div>
  )
}

