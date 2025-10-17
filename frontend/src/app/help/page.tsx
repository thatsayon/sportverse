import HelpCenter from '@/components/Landing/HelpCenter'
import React from 'react'

function Page() {
  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dn4ygnsfg/image/upload/v1760724068/help_oc9fqx.jpg')",
        objectFit: "cover",
        backgroundPosition: "center center",
      }}
    >
      <HelpCenter/>
    </div>
  )
}

export default Page
