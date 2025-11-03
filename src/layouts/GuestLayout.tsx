import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { Outlet } from "react-router-dom";

const GuestLayout = () => {
   return (
      <div className="min-h-screen flex flex-col">
         <Header />
         <Outlet />
         <Footer />
      </div>
   );
};

export default GuestLayout;
