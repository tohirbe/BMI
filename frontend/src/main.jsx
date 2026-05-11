import React    from "react";
import ReactDOM  from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import App       from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";
import "./i18n/config";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);