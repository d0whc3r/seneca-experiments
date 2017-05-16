import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import NodeRSA from 'node-rsa';

export default class {

  constructor() {
    this._KEY = 'superKeyPassword';
    this._COOKIE = 'auth';
    this._KEY = {
      algorithm: 'RS256',
      private: fs.readFileSync(path.resolve(__dirname, './jwtRS256.key'), { encoding: 'ascii' }),
      public: fs.readFileSync(path.resolve(__dirname, './jwtRS256.pem'), { encoding: 'ascii' }),
    };
  }

  enc(info) {
    const signed = jwt.sign(info, this._KEY.private, { algorithm: this._KEY.algorithm });
    const keyPublic = new NodeRSA(this._KEY.public);
    return keyPublic.encrypt(signed, 'base64', 'ascii');
  }

  dec(token) {
    try {
      const keyPrivate = new NodeRSA(this._KEY.private);
      const decrypted = keyPrivate.decrypt(token, 'ascii');
      return jwt.verify(decrypted, this._KEY.public, { algorithm: this._KEY.algorithm });
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