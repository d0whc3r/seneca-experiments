import axios from 'axios';

export default class {
  constructor() {
    this.axios = axios.create({
      baseURL: 'http://security.api:4444',
    });
  }

  checkToken(token) {
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
    console.log('getting token with', username, password);
    return this.axios
        .post('/oauth/v2/token', {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
          },
        }, {
          grant_type: 'password',
          client_id: '1_developmentClientId',
          client_secret: 'developmentSecretId',
          username,
          password,
        })
        .then((response) => {
          console.log('resolved', response);
          return response.data;
        });
  }
};
