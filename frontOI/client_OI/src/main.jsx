import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
// 1. import `NextUIProvider` component
import {NextUIProvider} from "@nextui-org/react";
import React from 'react'
import { OrderProvider } from './context/OrderCharger.jsx'


createRoot(document.getElementById('root')).render(
  <NextUIProvider>
    <StrictMode>
      <BrowserRouter>
        {/* <OrderProvider> */}
          <App />
        {/* </OrderProvider> */}
      </BrowserRouter>
    </StrictMode>
  </NextUIProvider>
)
