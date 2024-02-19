import { useContext } from 'react'
import AppContext from '../../../AppContext'
import { IChatSnippet } from '../../../types'

export default function ChatSnippet({ chatSnippet }: { chatSnippet: IChatSnippet }) {
  const { setSelectedChat } = useContext(AppContext)

  return (
    <button
      onClick={() => { setSelectedChat(chatSnippet._id) }}
      className="flex w-full items-center space-x-3 px-3 py-2 border-y shadow-md bg-gray-50 border-x  hover:bg-gray-100">
      <div className="flex items-center justify-center border text-gray-500 bg-gray-50 px-6 text-3xl font-extrabold rounded-full w-4 aspect-square">
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