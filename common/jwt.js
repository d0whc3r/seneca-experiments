import jwt from 'jwt-simple';

export default class Jwt {

  static KEY = 'superKeyPassword';
  _COOKIE = 'auth';

  _encode(info) {
    return jwt.encode(info, Jwt.KEY);
  }

  _decode(token) {
    return jwt.decode(token, Jwt.KEY);
  }

  setCookie(info) {
    return `${this._COOKIE}=${this._encode(info)};`;
  }

  getCookie(cookies) {
    const reg = new RegExp(`${this._COOKIE}=.*;`);
    const m = cookies.match(reg);
    let isValid = false;
    if (m.length) {
      const c = m[0].split('=')[1].replace(';', '');
      isValid = this._decode(c);
    }
    return isValid;
  }
};