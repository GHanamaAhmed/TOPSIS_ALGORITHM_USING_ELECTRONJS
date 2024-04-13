import { createBrowserRouter } from "react-router-dom";
import Start from "./views/start";
import Parameters from "./views/parameters";
import Topsis from "./views/topsis";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Start />,
  },
  {
    path: "/parameters",
    element: <Parameters />,
  },
  {
    path: "/topsis",
    element: <Topsis />,
  }
]);
export { routes };
