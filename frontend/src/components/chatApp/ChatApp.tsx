import { useContext } from "react";

import NewChat from "./forms/NewChat";
import AppContext from "../../AppContext";
import ChatMsgs from "./ChatMsgs/ChatMsgs";
import ChatsList from "./ChatsList/ChatsList";


export default function ChatApp() {
  const { modals } = useContext(AppContext)
  return (
    <div className="flex w-full h-screen">
      {
        modals === "new-chat" &&
        <NewChat />
      }
      {
        modals === "add-user-in-chat" &&
        <div></div>
      }
      <ChatsList />
      <ChatMsgs />
    </div>
  )
}
