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

};
