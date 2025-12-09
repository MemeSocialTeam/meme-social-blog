import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AlertProvider } from "./context/AlertContext";

function App() {
  return (
    <AlertProvider>
      <RouterProvider router={router} />
    </AlertProvider>
  );
}

export default App;
