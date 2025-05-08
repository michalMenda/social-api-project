import React from "react"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App.jsx'

console.log("Main.jsx loaded");
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
