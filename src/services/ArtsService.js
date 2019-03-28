import axios from 'axios';
import Config from '../config.json';

export function listArts(token) {
  return new Promise((resolve, reject) => {
    axios.get(Config.serverUrl+'/arts', { headers: { Authorization: 'Bearer ' + token }})
    .then((response) => {
      if (response && response.data){
        return resolve(response.data.arts);
      }
      reject();
    })
    .catch((err) => {
      console.log(err);
      reject();
    });
  });
}

export function getArt(token, artId) {
  return new Promise((resolve, reject) => {
    axios.get(Config.serverUrl+'/arts/'+artId, { headers: { Authorization: 'Bearer ' + token }})
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

export function approveArt(token, artId) {
  return new Promise((resolve, reject) => {
    axios.post(Config.serverUrl+'/arts/'+artId+'/approve', { approve: true }, { headers: { Authorization: 'Bearer ' + token }})
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
    case 'type_of_object':
      key = '物品類型';
      break;
    case 'materials':
      key = '材料';
      break;
    case 'techniques':
      key = '技術';
      break;
    case 'measurements':
      key = '度量';
      break;
    case 'inscriptions_and_markings':
      key = '銘文和標誌';
      break;
    case 'distinguishing_features':
      key = '突出的特徵';
      break;
    case 'title':
      key = '標題';
      break;
    case 'subject':
      key = '題材';
      break;
    case 'date_or_period':
      key = '日期或時代';
      break;
    case 'maker':
      key = '製作者';
      break;
    case 'brief':
      key = '簡要説明';
      break;
    case 'attachments':
      key = '描述檔案';
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
