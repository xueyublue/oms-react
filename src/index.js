import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { SnackbarProvider } from "notistack";

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
ReactDOM.render(
  // ! ant-design not yet support react strict mode. Have to wait for it to be resolved by ant-design team
  // <React.StrictMode>
  <BrowserRouter>
    <SnackbarProvider
      dense={true}
      maxSnack={1}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      autoHideDuration={3000}
    >
      <App />
    </SnackbarProvider>
  </BrowserRouter>,
  // </React.StrictMode>,
  document.getElementById("root")
);
