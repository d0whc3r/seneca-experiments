import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import NodeRSA from 'node-rsa';

export default class {
// export default {

  constructor() {
    console.log('constructor??!!');
    this._KEY = 'superKeyPassword';
    this._COOKIE = 'auth';
    this._KEY = {
      secure: true,
      algorithm: 'RS256',
      private: fs.readFileSync(path.resolve(__dirname, './jwtRS256.key'), { encoding: 'ascii' }),
      public: fs.readFileSync(path.resolve(__dirname, './jwtRS256.pem'), { encoding: 'ascii' }),
    };
  }

  enc(info) {
    let result = jwt.sign(info, this._KEY.private, { algorithm: this._KEY.algorithm });
    if (this._KEY.secure) {
      const keyPublic = new NodeRSA(this._KEY.public);
      result = keyPublic.encrypt(result, 'base64', 'ascii');
    }
    return result;
  }

  dec(token) {
    try {
      if (this._KEY.secure) {
        const keyPrivate = new NodeRSA(this._KEY.private);
        token = keyPrivate.decrypt(token, 'ascii');
      }
      return jwt.verify(token, this._KEY.public, { algorithm: this._KEY.algorithm });
    } catch (err) {
      console.error('WRONG TOKEN');
      return null;
    }
  }

  genCookie(info) {
    return `${this._COOKIE}=${this.enc(info)};`;
  }

  getCookie(cookies) {
    let isValid = false;
    if (!cookies) {
      return isValid;
    }
    const reg = new RegExp(`${this._COOKIE}=.*;`);
    const m = cookies.match(reg);
    if (m && m.length) {
      const c = m[0].split('=')[1].replace(';', '');
      isValid = this.dec(c);
    }
    return isValid;
  }

};
