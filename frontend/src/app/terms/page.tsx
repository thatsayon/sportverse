import TermsOfService from '@/components/Landing/TermsOfService'
import React from 'react'

function page() {
  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-bottom bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dn4ygnsfg/image/upload/v1760724179/terms_gjvyra.jpg')",
        objectFit: "cover",
        backgroundPosition: "center center",
      }}
    >
      <TermsOfService/>
    </div>
  )
}

export default page
