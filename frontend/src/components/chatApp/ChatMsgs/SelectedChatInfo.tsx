import { IChat } from "../../../types";

export default function SelectedChatInfo({ chatInfo, setModal }: {
  chatInfo: IChat | null
  setModal: React.Dispatch<React.SetStateAction<boolean>>
}) {
  if (!chatInfo) return <div></div>
  return <div className="flex items-center justify-between w-full bg-cyan-950 text-white font-semibold px-2.5 py-2.5">
    <button onClick={() => { setModal(true) }} className="group">
      <div className="group-hover:underline text-left" >{chatInfo.name}</div>
      <div className="flex space-x-5 text-xs font-normal">
        <span>Total members: {chatInfo.num_members}</span>
        <span>Total messages: {chatInfo.num_msgs}</span>
      </div>
    </button>
    <button>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
      </svg>
    </button>
  </div>;
}