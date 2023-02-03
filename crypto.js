const crypto = require('node:crypto');
require('dotenv').config();

const algorithm = 'aes-256-gcm';

const salt = process.env.CRYPTO_SECRET_KEY;

const getKey = (password) => {
   return crypto.scryptSync(password, salt, 32);
}

const encrypt = (text, password) => {

   const iv = crypto.randomBytes(16);

   const cipher = crypto.createCipheriv(algorithm, getKey(password), iv);

   const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

   return {
      iv: iv.toString('base64'),
      content: encrypted.toString('base64'),
      authTag: cipher.getAuthTag().toString('base64')
   };
};


const decrypt = (hash, password) => {
   const decipher = crypto.createDecipheriv(algorithm, getKey(password), Buffer.from(hash.iv, 'base64'));
   decipher.setAuthTag(Buffer.from(hash.authTag, 'base64'));
   let decrypted = decipher.update(Buffer.from(hash.content, 'base64'), null, 'utf8');
   decrypted += decipher.final();
   return decrypted.toString();
};

module.exports = {
   encrypt,
   decrypt
};