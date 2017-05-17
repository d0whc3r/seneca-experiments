import axios from 'axios';

export default class {
  constructor() {
    this.axios = axios.create({
      baseURL: 'http://security.api:4444',
    });
  }

  checkToken(info) {
    if (!info || !info.access_token) {
      return false;
    }
    const token = info.access_token;
    return this.axios.get('/api/user', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.data);
  }

  login({ username, password }) {
    if (!username || !password) {
      return false;
    }
    return this.axios
      .post('/oauth/v2/token', {
        grant_type: 'password',
        client_id: '1_developmentClientId',
        client_secret: 'developmentSecretId',
        username,
        password,
      }, {
        headers: {
          'Accept': 'application/json',
          'content-type': 'application/json',
        },
      })
      .then((response) => response.data);
  }
};
