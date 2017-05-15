import jwt from 'jwt-simple';

export default class {

  constructor() {
    this._KEY = 'superKeyPassword';
    this._COOKIE = 'auth';
  }

  _encode(info) {
    return jwt.encode(info, this._KEY);
  }

  _decode(token) {
    return jwt.decode(token, this._KEY);
  }

  genCookie(info) {
    return `${this._COOKIE}=${this._encode(info)};`;
  }

  // setCookie(response, info) {
  //   response.setHead('Cookie', this.genCookie(info));
  // }

  getCookie(request) {
    let isValid = false;
    const cookies = request.headers.cookie;
    if(!cookies) {
      return isValid;
    }
    const reg = new RegExp(`${this._COOKIE}=.*;`);
    const m = cookies.match(reg);
    if (m && m.length) {
      const c = m[0].split('=')[1].replace(';', '');
      isValid = this._decode(c);
    }
    return isValid;
  }
};