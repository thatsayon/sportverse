import ChatConversation from '@/components/Admin/Chat/ChatConversation'
import React from 'react'

function page({params}) {

  //console.log("id:", params.chatId)
  return (
    <div>
      <ChatConversation chatId={params.chatId}/>
    </div>
  )
}

export default page
