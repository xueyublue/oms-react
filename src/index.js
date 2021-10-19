import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
ReactDOM.render(
  // ! ant-design not yet support react strict mode. Have to wait for it to be resolved by ant-design team
  // <React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  // </React.StrictMode>,
  document.getElementById("root")
);
