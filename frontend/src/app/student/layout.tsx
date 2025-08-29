import Footer from "@/components/Shared/Footer";
import Navbar from "@/components/Student/Navbar";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
        <Navbar/>
      {children}
      <Footer />
    </div>
  );
}

export default layout;
