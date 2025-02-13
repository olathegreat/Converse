import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner.tsx";
import { Provider } from "react-redux";
import store from "./utils/store.ts";
import { Socketprovider } from "./context/SocketContext.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <Socketprovider>
        <Toaster />
        <App />
      </Socketprovider>
    </Provider>
  </BrowserRouter>
);
