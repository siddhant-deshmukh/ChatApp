import { useContext } from 'react';
import { Spinner } from 'flowbite-react';

import AppContext from './AppContext';
import ChatApp from './components/chatApp/ChatApp';
import AuthComponents from './components/authComponents/AuthComponents';

export default function App() {
  const { authLoading, user } = useContext(AppContext)

  return <div className='flex w-full justify-center'>
    {
      authLoading &&
      <div className='pt-[10%]'>
        <Spinner aria-label="Extra large spinner example" size="xl" />
      </div>
    }
    {
      !authLoading && !user &&
      <div className='pt-[10%]'>
        <AuthComponents />
      </div>
    }
    {
      !authLoading && user &&
      <ChatApp />
    }
  </div>
}