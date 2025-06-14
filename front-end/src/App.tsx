import Routes from "@/routes";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes />
    </BrowserRouter>
  );
};

export default App;
