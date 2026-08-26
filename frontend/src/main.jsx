import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { PublicClientApplication, EventType } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './authConfig'

const msalInstance = new PublicClientApplication(msalConfig)

msalInstance.initialize().then(() => {
  msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
      msalInstance.setActiveAccount(event.payload.account)
    }
  })

  createRoot(document.getElementById('root')).render(
      <MsalProvider instance={msalInstance}>
        <GoogleOAuthProvider clientId="58766295749-ndtv46el8t9aeio60ij5pfrbofqkmlv9.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
      </MsalProvider>
  )
})