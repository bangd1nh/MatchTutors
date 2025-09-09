import { Outlet } from "react-router-dom";

const GuestLayout = () => {
   return (
      <div className="min-h-screen flex flex-col">
         <Outlet />
      </div>
   );
};

export default GuestLayout;
