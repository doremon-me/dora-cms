import Routes from "@/routes";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import Loader from "./components/shared/loader";

const App = () => {
  return (
    <Suspense
      fallback={<Loader animation="spin" size="md" variant="fullscreen" />}
    >
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes />
      </BrowserRouter>
    </Suspense>
  );
};

export default App;
