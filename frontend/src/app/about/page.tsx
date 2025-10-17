import AboutUs from '@/components/Landing/AboutUs'
import React from 'react'

function page() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'url(https://res.cloudinary.com/dn4ygnsfg/image/upload/v1760122914/about_xyonk4.jpg)',
      }}
    >
      <div className="min-h-screen bg-black/40">
        <AboutUs />
      </div>
    </div>
  )
}

export default page