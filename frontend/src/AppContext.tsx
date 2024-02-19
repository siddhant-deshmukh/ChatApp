import { IChatSnippet, IUser } from "./types";
import React, { useEffect, useState } from "react";

export const AppContext = React.createContext<{

  user: IUser | null,
  authLoading: boolean,
  chatsList: IChatSnippet[]
  selectedChat: string | null,
  modals: "new-chat" | "add-user-in-chat" | null
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>,
  setAuthLoading: (value: React.SetStateAction<boolean>) => void
  setChatsList: React.Dispatch<React.SetStateAction<IChatSnippet[]>>
  setSelectedChat: React.Dispatch<React.SetStateAction<string | null>>
  setModals: React.Dispatch<React.SetStateAction<"new-chat" | "add-user-in-chat" | null>>
}>({
  user: null,
  modals: null,
  chatsList: [],
  authLoading: true,
  selectedChat: null,
  setUser: () => { },
  setModals: () => { },
  setChatsList: () => { },
  setAuthLoading: () => { },
  setSelectedChat: () => { },
})


export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {

  const [user, setUser] = useState<IUser | null>(null)
  const [chatsList, setChatsList] = useState<IChatSnippet[]>([])
  const [authLoading, setAuthLoading] = useState<boolean>(true)
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [modals, setModals] = useState<null | 'new-chat' | 'add-user-in-chat'>(null)

  useEffect(() => {
    setAuthLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user && data.user._id) {
          setUser(data.user)
          console.log('got the data user', data.user.type)
        } else {
          setUser(null)
        }
      }).catch(() => {
        console.error("Error while fetching the user data")
      })
      .finally(() => {
        setAuthLoading(false)
      })
  }, [])

  return (
    <AppContext.Provider value={{
      user, setUser,
      modals, setModals,
      chatsList, setChatsList,
      authLoading, setAuthLoading,
      selectedChat, setSelectedChat
    }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext