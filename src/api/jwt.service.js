const BEARER_TOKEN_KEY = 'bearer-token'
const REAUTH_TOKEN_KEY = 'reauth-token'
const LAST_AUTH = 'last-auth'

export const getToken = () => {
  return window.localStorage.getItem(BEARER_TOKEN_KEY)
}

export const getReauthToken = () => {
  return window.localStorage.getItem(REAUTH_TOKEN_KEY)
}

export const getNextAuth = () => {
  return window.localStorage.getItem(LAST_AUTH)
}

export const saveToken = token => {
  window.localStorage.setItem(BEARER_TOKEN_KEY, token)
}

export const saveReauthToken = token => {
  window.localStorage.setItem(REAUTH_TOKEN_KEY, token)
}

export const saveNextAuth = nextAuth => {
  window.localStorage.setItem(LAST_AUTH, nextAuth)
}

export const destroyToken = () => {
  window.localStorage.removeItem(BEARER_TOKEN_KEY)
}

export const destroyReauthToken = () => {
  window.localStorage.removeItem(REAUTH_TOKEN_KEY)
}

export const destroyNextAuth = () => {
  window.localStorage.removeItem(LAST_AUTH)
}

export default { getToken, getReauthToken, getNextAuth, saveToken, saveReauthToken, saveNextAuth, destroyToken, destroyReauthToken, destroyNextAuth }
