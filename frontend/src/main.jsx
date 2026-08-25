import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './authConfig'

const msalInstance = new PublicClientApplication(msalConfig)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="58766295749-ndtv46el8t9aeio60ij5pfrbofqkmlv9.apps.googleusercontent.com">
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)