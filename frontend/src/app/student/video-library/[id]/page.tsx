import VideoPlayer from '@/components/Shared/VideoPlayer'
import React from 'react'

interface PageProps {
  params: {
    id: string;
  };
}

function page({params}: PageProps) {
  const {id} = params 
  return (
    <div>
      <VideoPlayer route='student' id={id}/>
    </div>
  )
}

export default page
