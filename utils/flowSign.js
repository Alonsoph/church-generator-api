const crypto = require('node:crypto');

function firmarParams(params, secretKey) {
  const keys = Object.keys(params);
  keys.sort();
  let toSign = '';
  for (const key of keys) {
    toSign += key + params[key];
  }
  return crypto.createHmac('sha256', secretKey).update(toSign).digest('hex');
}

module.exports = { firmarParams };
