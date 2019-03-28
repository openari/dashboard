import axios from 'axios';
import Config from '../config.json';

export function listApplications(token) {
  return new Promise((resolve, reject) => {
    axios.get(Config.serverUrl+'/applications', { headers: { Authorization: 'Bearer ' + token }})
    .then((response) => {
      if (response && response.data){
        return resolve(response.data.applications);
      }
      reject();
    })
    .catch((err) => {
      console.log(err);
      reject();
    });
  });
}

export function getApplication(token, applicationId) {
  return new Promise((resolve, reject) => {
    axios.get(Config.serverUrl+'/applications/'+applicationId, { headers: { Authorization: 'Bearer ' + token }})
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

export function approveApplication(token, applicationId) {
  return new Promise((resolve, reject) => {
    axios.post(Config.serverUrl+'/applications/'+applicationId+'/approve', { approve: true }, { headers: { Authorization: 'Bearer ' + token }})
    .then((response) => {
      resolve();
    })
    .catch((err) => {
      console.log(err);
      reject();
    });
  });
}

export function listApplicationTokens(token, applicationId) {
  return new Promise((resolve, reject) => {
    axios.get(Config.serverUrl+'/applications/' + applicationId + '/tokens', { headers: { Authorization: 'Bearer ' + token }})
    .then((response) => {
      if (response && response.data){
        return resolve(response.data.tokens);
      }
      reject();
    })
    .catch((err) => {
      console.log(err);
      reject();
    });
  });
}

export function createApplicationToken(token, applicationId) {
  return new Promise((resolve, reject) => {
    axios.post(Config.serverUrl+'/applications/'+applicationId+'/tokens', {}, { headers: { Authorization: 'Bearer ' + token }})
    .then((response) => {
      resolve(response.data);
    })
    .catch((err) => {
      console.log(err);
      reject();
    });
  });
}

export function invalidateApplicationToken(token, applicationId, tokenId) {
  return new Promise((resolve, reject) => {
    axios.post(Config.serverUrl+'/applications/'+applicationId+'/tokens/'+tokenId+'/invalidate', { approve: true }, { headers: { Authorization: 'Bearer ' + token }})
    .then((response) => {
      resolve();
    })
    .catch((err) => {
      console.log(err);
      reject();
    });
  });
}

export function columnNameLookup(key) {
  switch (key) {
    case 'applicant':
      key = '申請人/單位';
      break;
    case 'phone':
      key = '聯絡電話';
      break;
    case 'email':
      key = 'Email';
      break;
    case 'url':
      key = '單位或個人社群網頁';
      break;
    case 'source':
      key = '如何得知這個實驗計畫';
      break;
    case 'description':
      key = '簡易申請描述';
      break;
    case 'status':
      key = '申請狀態';
      break;
    case 'invitation_code':
      key = '邀請碼';
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
