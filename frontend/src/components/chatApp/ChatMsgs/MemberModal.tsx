import { useCallback, useEffect, useState } from "react"
import { IChat, IMember } from "../../../types"
import axios from "axios"

export default function MemberModal({ chatMembersInfo, chatIdRef, setChatMembersInfo, chatInfo, selectedChat, setModal }: {
  chatInfo: IChat | null
  selectedChat: string | null
  chatMembersInfo: Map<string, IMember>
  chatIdRef: React.MutableRefObject<string>
  setModal: React.Dispatch<React.SetStateAction<boolean>>
  setChatMembersInfo: React.Dispatch<React.SetStateAction<Map<string, IMember>>>
}) {

  const [email, setEmail] = useState<string>("")
  const [chatMembers, setChatMembers] = useState<string[]>([])


  function addMemberisChatMembersState(member: IMember) {
    setChatMembers((prev) => { return [member._id, ...prev] })
    setChatMembersInfo((prev) => {
      let upgraded = new Map(prev)
      upgraded.set(member._id, member)
      return upgraded
    })
  }

  const getMembers = useCallback((selectedChat: string) => {
    axios.get(`${import.meta.env.VITE_API_URL}/mem/${selectedChat}`, { withCredentials: true })
      .then(({ data }) => {
        if (data.users) {
          (data.users as IMember[]).forEach((member) => {
            addMemberisChatMembersState(member)
          })
        }
        console.log(data)
      }).catch(() => {

      })
  }, [])  

  useEffect(() => {
    if (chatIdRef.current != selectedChat && selectedChat) {
      console.log("Here is use effect")
      setChatMembers([])
      getMembers(selectedChat)
    }
  }, [selectedChat])
 
  return (
    <div className="border-l h-full bg-white w-full xl:w-[380px] ">
      <div className="w-full flex items-center h-[60px] bg-cyan-950 px-3">
        <button className="text-white" onClick={() => { setModal(false) }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="px-3 my-5">
        <h1 className="text-2xl font-semibold">{chatInfo?.name}</h1>
        <p className="text-lg text-gray-700">{chatInfo?.description}</p>
      </div>
      <div className="w-full flex space-x-1 px-3 justify-between">
        <input
          value={email}
          className="px-2 py-0.5 border w-full outline-none border-cyan-950 rounded-lg"
          onChange={(e) => { setEmail(e.target.value) }}
        />
        <button
          onClick={() => {
            if (!selectedChat) return;
            axios.post(`${import.meta.env.VITE_API_URL}/mem/${selectedChat}`, { email }, { withCredentials: true })
              .then(({ data }) => {
                console.log(data, data.member)
                if (data.member) {
                  setEmail("")
                  // getMembers(selectedChat)
                  setChatMembers((prev) => {
                    console.log([data.member].concat(prev.slice()))
                    return [data.member].concat(prev.slice())
                  })
                }
              }).catch((err) => {
                console.error("While adding member", err)
              })
          }}
          className="min-w-fit bg-cyan-900 text-white px-3 py-2 rounded-lg  font-semibold">Add Member +</button>
      </div>
      <div className="px-3 mt-5">
        <div>{chatInfo?.num_members} Members</div>
        <ul>
          {
            chatMembers.map((mem_id) => {
              const memInfo = chatMembersInfo.get(mem_id)
              if (!memInfo) {
                return <div></div>
              }
              const { name, _id, last_seen } = memInfo
              const _date = new Date(last_seen)
              return (
                <div
                  key={_id}
                  className="flex w-full items-center space-x-3 px-3 py-2 border-y my-2 bg-gray-50 border-x">
                  <div className="flex items-center justify-center border text-gray-500 bg-gray-200 px-5 text-2xl font-extrabold rounded-full w-4 aspect-square">
                    <span>
                      {name[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm w-full">
                    <div className="text-gray-800 font-semibold">{name}</div>
                    <div className="flex text-xs font-medium w-full justify-between text-gray-500">
                      <span>{_date.toDateString().slice(4)}</span>
                      <span>{_date.toTimeString().slice(0, 5)}</span>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}
