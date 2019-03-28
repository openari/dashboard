import axios from 'axios';
import decode from 'jwt-decode';
import Config from '../config.json';
const ID_TOKEN_KEY = 'id_token';

export function login(email, password) {
  return new Promise((resolve, reject) => {
    axios.post(Config.serverUrl+'/login', {
      email: email,
      password: password
    })
    .then((response) => {
      setIdToken(response.data);
      resolve(getIdToken());
    })
    .catch((err) => {
      console.log(err);
      reject();
    });
  });
}

export function forgetPassword(email) {
  return new Promise((resolve, reject) => {
    axios.post(Config.serverUrl+'/forget-password', {
      email: email
    })
    .then((response) => {
      resolve();
    })
    .catch((err) => {
      console.log(err);
      reject();
    });
  });
}

export function changePassword(token, password) {
  return new Promise((resolve, reject) => {
    axios.post(Config.serverUrl+'/change-password', {
      password: password
    }, { headers: { Authorization: 'Bearer ' + token }})
    .then((response) => {
      resolve();
    })
    .catch((err) => {
      console.log(err);
      reject();
    });
  });
}

export function logout() {
  clearIdToken();
}

export function requireAuth(nextState, replace) {
  if (!isLoggedIn()) {
    replace({pathname: '/'});
  }
}

export function getIdToken() {
  let value = localStorage.getItem(ID_TOKEN_KEY);
  return JSON.parse(value);
}

export function getToken() {
  let value = localStorage.getItem(ID_TOKEN_KEY);
  let IdToken = JSON.parse(value);
  return IdToken.token;
}

function clearIdToken() {
  localStorage.removeItem(ID_TOKEN_KEY);
}

// Get and store id_token in local storage
export function setIdToken(idToken) {
  let value = JSON.stringify(idToken);
  localStorage.setItem(ID_TOKEN_KEY, value);
}

export function isLoggedIn() {
  const idToken = getIdToken();
  console.log(idToken);
  return !!idToken && !isTokenExpired(idToken);
}

function getTokenExpirationDate(encodedToken) {
  const token = decode(encodedToken);
  if (!token.exp) { return null; }

  const date = new Date(0);
  date.setUTCSeconds(token.exp);

  return date;
}

function isTokenExpired(idToken) {
  const token = idToken.token;
  const expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}
