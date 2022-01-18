import React, { useState, createContext } from "react";

export const BackendAPIContext = createContext();

export const BackendAPIProvider = (props) => {
  const [baseUrl, setBaseUrl] = useState("");
  const hostname = window.location.hostname;
  const newBaseUrl = `http://10.33.1.166:8090/wms7/rest/oms`;
  if (newBaseUrl !== baseUrl) setBaseUrl(newBaseUrl);
  return <BackendAPIContext.Provider value={{ baseUrl }}>{props.children}</BackendAPIContext.Provider>;
};
