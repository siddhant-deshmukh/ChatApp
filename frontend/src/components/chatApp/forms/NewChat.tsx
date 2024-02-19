import axios from 'axios'
import React, { useContext, useState } from 'react'

import AppContext from '../../../AppContext'
import { IChatSnippet } from '../../../types'

interface IFormInputs {
  name: string,
  description: string,
  type: "group"
}
const defaultInputs: IFormInputs = {
  name: "",
  description: "",
  type: "group"
}

export default function NewChat() {

  const [loding, setLoding] = useState<boolean>(false)
  const { setModals, setChatsList } = useContext(AppContext)
  const [formInputs, setFormInputs] = useState<IFormInputs>(defaultInputs)


  function handleInputChange(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
    setFormInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }
  function close() {
    setFormInputs(defaultInputs)
    setModals(null)
  }

  function postNewChat(formInputs: IFormInputs) {
    setLoding(true)
    axios.post(`${import.meta.env.VITE_API_URL}/c/`, { ...formInputs }, { withCredentials: true })
      .then(({ status, data }) => {
        if (status === 201 && data.chat as IChatSnippet) {
          setChatsList(prev => {
            return [{ id: data.chat._id, _id: data.chat._id, name: data.chat.name }, ...prev]
          })
          close()
        } else {
          console.error("Create chat", status, data.chat)
        }
      }).catch((err) => {
        console.error("Create chat", err)
      }).finally(() => {
        setLoding(false)
      })
  }

  return (
    <div className='fixed z-40 grid place-content-center top-0 left-0 w-full h-screen bg-black bg-opacity-40'>
      <button className='z-20 absolute top-5 right-5 p-2.5 bg-white rounded-full' onClick={close}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
      <div className='rounded-lg p-5 bg-white w-96'>
        <h3 className='text-lg font-semibold mb-10'>Create new Chat</h3>
        <div className='flex flex-col mt-2'>
          <label className='text-xs font-semibold text-gray-600'>Title:</label>
          <input
            name='name'
            value={formInputs.name}
            onChange={handleInputChange}
            className='p-2 outline-none border border-gray-300 rounded-lg' />
        </div>
        <div className='flex flex-col mt-2'>
          <label className='text-xs font-semibold text-gray-600'>Description:</label>
          <textarea
            name='description'
            value={formInputs.description}
            onChange={handleInputChange}
            className='p-2 outline-none focus:border-none border border-gray-300 rounded-lg' />
        </div>
        <div className='flex w-full justify-between space-x-5'>
          <button
            onClick={close}
            className='text-cyan-800 border border-cyan-700 hover:bg-cyan-50 rounded-lg mt-10 w-full py-1.5 font-semibold'>
            Cancel
          </button>
          <button
            disabled={loding}
            onClick={() => { postNewChat(formInputs) }}
            className='bg-cyan-700 text-white hover:bg-cyan-800 rounded-lg mt-10 w-full py-1.5 font-semibold'>
            {
              loding && "Loding..."
            }
            {
              !loding && "Create"
            }
          </button>
        </div>

      </div>
    </div>
  )
}
