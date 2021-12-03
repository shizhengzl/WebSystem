import Cookies from 'js-cookie'

const TokenKey = 's_token'
const TokenCompany = 's_company'



export function getCompany() {
  return Cookies.get(TokenCompany)
}

export function setCompany(token) {
  return Cookies.set(TokenCompany, token)
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
