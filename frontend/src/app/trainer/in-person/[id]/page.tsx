import TrainerProfile from '@/components/Shared/TrainerProfile';
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
      <TrainerProfile id={id}/>
    </div>
  )
}

export default page
