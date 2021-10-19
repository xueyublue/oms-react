import React, { useState, createContext } from "react";

export const BackendAPIContext = createContext();

export const BackendAPIProvider = (pros) => {
  const [baseUrl, setBaseUrl] = useState("");
  const hostname = window.location.hostname;
  const newBaseUrl = `http://${hostname}:8090/wms7/rest/oms`;
  if (newBaseUrl !== baseUrl) setBaseUrl(newBaseUrl);
  return <BackendAPIContext.Provider value={{ baseUrl }}>{pros.children}</BackendAPIContext.Provider>;
};
