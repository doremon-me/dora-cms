import { Outlet } from "react-router-dom";
import Header from "@/components/const/header";

const ManageLayout = () => {
  return (
    <div className="container mx-auto">
      <Header />
      <main className="px-4 mb-10 ">
        <Outlet />
      </main>
    </div>
  );
};

export default ManageLayout;
