import VerificationAlert from '@/components/Element/VerificationAlert'
import Navbar from '@/components/Trainer/Navbar'
import React, { ReactNode } from 'react'

function layout({children}:{children:ReactNode}) {
  return (
    <div>
        <Navbar/>
      <div className='min-h-screen'>
        <VerificationAlert/>
        {children}
      </div>
    </div>
  )
}

export default layout
