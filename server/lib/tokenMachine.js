const crypto = require('crypto');

let tokenMachine = {
  generateTokens: function(config, publicToken) {
    return new Promise(function (resolve, reject) {
      try {
        publicToken = publicToken || crypto.randomBytes(16).toString('hex');
        
        let hmac = crypto.createHmac('sha256', process.env.TOKEN || config.keys.token);
        hmac.setEncoding('hex');
        hmac.write(new Buffer(publicToken, 'utf-8'));
        hmac.end();
        let privateToken = hmac.read();
        resolve({ public: publicToken, private: privateToken });
      } catch (err) {
        reject(err);
      }
    });
  }
};

module.exports = tokenMachine;
