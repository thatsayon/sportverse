import PrivacyPolicy from "@/components/Landing/PriveryPolicy";
import React from "react";

function page() {
  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dn4ygnsfg/image/upload/v1760723917/policy_z0qpdf.jpg')",
        objectFit: "cover",
        backgroundPosition: "center center",
      }}
    >
      <PrivacyPolicy />
    </div>
  );
}

export default page;
