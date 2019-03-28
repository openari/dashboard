import axios from 'axios';
import Config from '../config.json';

export function listPointers(token) {
  return new Promise((resolve, reject) => {
    axios.get(Config.serverUrl+'/pointers', { headers: { Authorization: 'Bearer ' + token }})
    .then((response) => {
      if (response && response.data){
        return resolve(response.data.pointers);
      }
      reject();
    })
    .catch((err) => {
      console.log(err);
      reject();
    });
  });
}

export function getPointer(token, pointerId) {
  return new Promise((resolve, reject) => {
    axios.get(Config.serverUrl+'/pointers/'+pointerId, { headers: { Authorization: 'Bearer ' + token }})
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

export function approvePointer(token, pointerId) {
  return new Promise((resolve, reject) => {
    axios.post(Config.serverUrl+'/pointers/'+pointerId+'/approve', { approve: true }, { headers: { Authorization: 'Bearer ' + token }})
    .then((response) => {
      resolve();
    })
    .catch((err) => {
      console.log(err);
      reject();
    });
  });
}

export function identificationColumnNameLookup(key) {
  switch (key) {
    case 'applicant':
      key = '作品碼申請人/單位';
      break;
    case 'phone':
      key = '聯絡電話';
      break;
    case 'email':
      key = 'Email';
      break;
    case 'pointer_url':
      key = '指向連結';
      break;
    case 'abstract':
      key = '描述';
      break;
    case 'status':
      key = '申請狀態';
      break;
  }
  return key;
}

export function statusNameLookup(value) {
  switch (value) {
    case 'pending':
      value = '審核中';
      break;
    case 'approved':
      value = '審核通過';
      break;
  }
  return value;
}
