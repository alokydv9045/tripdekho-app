"use client";

import { usePathname } from "next/navigation";
import Footer from "./index";

const FooterWrapper = () => {
  const pathname = usePathname();
  
  // Define routes where Footer should not appear
  const hideFooterRoutes = ["/login", "/signup"];
  
  if (hideFooterRoutes.includes(pathname)) {
    return null;
  }

  return <Footer />;
};

export default FooterWrapper;
