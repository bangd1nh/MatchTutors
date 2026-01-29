import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryProvider } from "./providers/QueryProvider";
import ToastContainer from "./components/common/ToastContainer";
import { routes } from "./routes";

const router = createBrowserRouter(routes);

function App() {
   return (
      <QueryProvider>
         <ToastContainer />
         <RouterProvider router={router} />
      </QueryProvider>
   );
}

export default App;
