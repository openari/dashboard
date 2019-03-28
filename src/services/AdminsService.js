import axios from 'axios';
import Config from '../config.json';

export function listAdmins(token) {
  return new Promise((resolve, reject) => {
    axios.get(Config.serverUrl+'/admins', { headers: { Authorization: 'Bearer ' + token }})
    .then((response) => {
      if (response && response.data){
        return resolve(response.data.admins);
      }
      reject();
    })
    .catch((err) => {
      console.log(err);
      reject();
    });
  });
}

export function getAdmin(token, adminId) {
  return new Promise((resolve, reject) => {
    axios.get(Config.serverUrl+'/admins/'+adminId, { headers: { Authorization: 'Bearer ' + token }})
    .then((response) => {
      if (response && response.data){
        return resolve(response.data);
      }
      reject();
    })
    .catch((err) => {
      console.log(err);
      reject();
    });
  });
}

export function createAdmin(token, name, email, password) {
  return new Promise((resolve, reject) => {
    axios.post(Config.serverUrl+'/admins', {
      name: name,
      email: email,
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

export function updateAdminStatus(token, adminId, disabled) {
  return new Promise((resolve, reject) => {
    axios.put(Config.serverUrl+'/admins/'+adminId+'/status', {
      disabled: disabled
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
