import { IUser } from "./types";
import React, { useEffect, useState } from "react";

export const AppContext = React.createContext<{

  user: IUser | null,
  authLoading: boolean,
  selectedChat: string | null,
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>,
  setAuthLoading: (value: React.SetStateAction<boolean>) => void
  setSelectedChat: React.Dispatch<React.SetStateAction<string | null>>
}>({
  user: null,
  authLoading: true,
  selectedChat: null,
  setUser: () => { },
  setAuthLoading: () => { },
  setSelectedChat: () => { }
})


export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {

  const [user, setUser] = useState<IUser | null>(null)
  const [authLoading, setAuthLoading] = useState<boolean>(true)
  const [selectedChat, setSelectedChat] = useState<string | null>(null)

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
      authLoading, setAuthLoading,
      selectedChat, setSelectedChat
    }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext