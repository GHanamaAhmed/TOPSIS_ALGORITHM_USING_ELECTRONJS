import { Button } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import DataContextProvider from "./context/dataContext";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <DataContextProvider>
        <RouterProvider router={routes} />
      </DataContextProvider>
    </ThemeProvider>
  );
}

export default App;
