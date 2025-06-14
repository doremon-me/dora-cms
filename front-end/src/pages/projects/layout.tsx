import { Outlet } from "react-router-dom";

const ProjectsLayout = () => {
  return (
    <div className="container mx-auto">
      <main className="px-4 mb-10 ">
        <Outlet />
      </main>
    </div>
  );
};

export default ProjectsLayout;
