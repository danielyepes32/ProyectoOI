import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
// 1. import `NextUIProvider` component
import {NextUIProvider} from "@nextui-org/react";
import React from 'react'


createRoot(document.getElementById('root')).render(
  <NextUIProvider>
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
  </NextUIProvider>
)
