import TrainerProfile from '@/components/Shared/TrainerProfile'
import React from 'react'

interface ParamsProps{
  id: string
}

function page({params}:{params: ParamsProps}) {
  const {id} = params
  return (
    <div>
      <TrainerProfile id={id}/>
    </div>
  )
}

export default page
