export const msalConfig = {
  auth: {
    clientId: "a41ef414-100c-4aa4-bf20-19506f1c801d",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "http://localhost:5173/auth-redirect"
  },
  cache: {
    cacheLocation: "sessionStorage"
  }
}

export const loginRequest = {
  scopes: ["User.Read"]
}