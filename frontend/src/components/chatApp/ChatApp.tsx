import { useContext, useEffect, useRef, useState } from "react";
import ChatMsgs from "./ChatMsgs/ChatMsgs";
import ChatsList from "./ChatsList/ChatsList";
import AppContext from "../../AppContext";
import { IChat } from "../../types";
import axios from "axios";

export default function ChatApp() {


  return (
    <div className="flex w-full h-screen">
      <ChatsList />
      <ChatMsgs />
    </div>
  )
}
