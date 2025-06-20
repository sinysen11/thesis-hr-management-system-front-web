import Cookies from 'js-cookie';

const TokenKey = 'token';
const RefreshTokenKey = 'refresh_token';
const UserInfoKey = 'userInfo';
const token_domain = process.env.VUE_APP_TOKEN_DOMAIN || 'localhost';

export async function getToken(tokenKey) {
  const TOKEN_KEY = tokenKey || TokenKey;
  return Cookies.get(TOKEN_KEY);
}

export function setToken(tokenKey, token, expires = 30) {
  const TOKEN_KEY = tokenKey || TokenKey;
  if (expires === 0) {
    return Cookies.set(TOKEN_KEY, token);
  }
  return Cookies.set(TOKEN_KEY, token, { expires, domain: token_domain });
}

export function setUserInfoCookie(data) {
  if (data) {
    data = JSON.stringify(data);
  }
  return Cookies.set(UserInfoKey, data, { expires: 30, domain: token_domain });
}

export function getUserInfoCookie() {
  return Cookies.get(UserInfoKey);
}

export function removeUserInfoCookie() {
  const { cookieKey } = cookieParams(UserInfoKey);
  return Cookies.remove(cookieKey, { domain: token_domain });
}

export function removeToken(key) {
  return Cookies.remove(key, { domain: token_domain });
}

export function removeAuthToken() {
  Cookies.remove(RefreshTokenKey, { domain: token_domain });
  return;
}

export function removeAllToken() {
  Cookies.remove(UserInfoKey, { domain: token_domain });
  Cookies.remove(RefreshTokenKey, { domain: token_domain });
  Cookies.remove(TokenKey, { domain: token_domain });
  return;
}

function cookieParams(key) {
  let domain = 'localhost';
  const { hostname } = window.location;
  const cookieKey = key || TokenKey;

  if (hostname.indexOf('localhost') === -1) {
    domain = process.env.VUE_APP_TOKEN_DOMAIN || 'localhost';
  }

  return {
    domain,
    cookieKey
  };
}
