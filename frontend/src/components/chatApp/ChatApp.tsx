import { useContext, useEffect } from "react";

import NewChat from "./forms/NewChat";
import AppContext from "../../AppContext";
import ChatMsgs from "./ChatMsgs/ChatMsgs";
import ChatsList from "./ChatsList/ChatsList";
import socket from "../../socket";


export default function ChatApp() {
  const { modals, user } = useContext(AppContext)

  useEffect(() => {
    if (user) {
      socket.auth = { username: user._id };
      socket.connect();


      socket.on("connect_error", (err) => {
        if (err.message === "invalid username") {
          console.error("Error connection")
        }
      });
    }
    return () => {
      console.log("Socket off connection error")
      socket.off("connect_error");
    }
  }, [user])

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
