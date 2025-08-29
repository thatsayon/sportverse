import Footer from '@/components/Shared/Footer'
import Navbar from '@/components/Trainer/Navbar'
import React, { ReactNode } from 'react'

function layout({children}:{children:ReactNode}) {
  return (
    <div>
        <Navbar/>
      <div className='min-h-screen'>
        {children}
      </div>
      <Footer/>
    </div>
  )
}

export default layout
