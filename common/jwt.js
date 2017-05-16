// import jwt from 'jwt-simple';
const jwt = require('jwt-simple');

export default class {

  constructor() {
    this._KEY = 'superKeyPassword';
    this._COOKIE = 'auth';
    this._SALT = `!:!ABCDEF:${this._COOKIE}:123456!:!`;
  }

  enc(info) {
    const encoded = new Buffer(jwt.encode(this._SALT + JSON.stringify(info) + this._SALT, this._KEY, 'HS512')).toString('base64');
    console.log('encoded info', this._KEY, encoded);
    return encoded;
    // return jwt.encode(info, this._KEY);
  }

  dec(token) {
    const parsed = new Buffer(token, 'base64').toString('ascii');
    const p = parsed.replace(new RegExp(this._SALT, 'g'), '');
    const d = jwt.decode(p, this._KEY, false, 'HS512');
    console.log('decoed', d);
    const decoded = JSON.parse(d);
    console.log('token', token, this._KEY, decoded);
    return decoded;
    // return jwt.decode(token, this._KEY);
  }

  genCookie(info) {
    const e = this.enc(info);
    console.log('info and token', info, e, e.length);
    return `${this._COOKIE}=${this.enc(info)};`;
  }

  // setCookie(response, info) {
  //   response.setHead('Cookie', this.genCookie(info));
  // }

  getCookie(cookies) {
    let isValid = false;
    // const cookies = request.headers.cookie;
    console.log(cookies);
    if (!cookies) {
      return isValid;
    }
    const reg = new RegExp(`${this._COOKIE}=.*;`);
    const m = cookies.match(reg);
    console.log('m', m, m.length);
    if (m && m.length) {
      const c = m[0].split('=')[1].replace(';', '');
      console.log('c', c);
      isValid = this.dec(c);
      console.log(isValid);
    }
    return isValid;
  }

  getCookie2(cookies) {
    // let isValid = false;
    // const cookies = request.headers.cookie;
    console.log(cookies);
    if (!cookies || !cookies[this._COOKIE]) {
      return false;
    }
    // const reg = new RegExp(`${this._COOKIE}=.*;`);
    // const m = cookies.match(reg);
    // if (m && m.length) {
    //   const c = m[0].split('=')[1].replace(';', '');
    return this._decode(cookies[this._COOKIE]);
    // }
    // return isValid;
  }
};