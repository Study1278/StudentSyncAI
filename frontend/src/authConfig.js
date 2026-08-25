export const msalConfig = {
  auth: {
    clientId: "09c1f4af-d9f4-45fc-8286-aa8f2c5a7702",
    authority: "https://login.microsoftonline.com/consumers",
    redirectUri: window.location.origin + "/blank.html",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
}

export const loginRequest = {
  scopes: ["User.Read"],
}