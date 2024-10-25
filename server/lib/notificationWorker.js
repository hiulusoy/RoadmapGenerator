var RSMQWorker = require( "rsmq-worker" );
var smsWorker = new RSMQWorker( "smsQueue" );
const smsLib = require("./smsLib");
const db = require('../models');
const notificationBroker = require('./notificationQueue');

smsWorker.on( "message", function( msg, next, id ){

  const msgJson = JSON.parse(msg);
  //send sms
  smsLib.sendSMS(msgJson.phone1 || msgJson.phone2, msgJson.content, (err, result) => {
    //hata var ise kuyruga geri at
    if(err) {
      console.log('error = ' + JSON.stringify(err));
      notificationBroker.send_data_to_queue('smsQueue', msgJson);
    } else {
      //yok ise loga yaz
      db.NotificationLog.create({ claimId: msgJson.claimId, type: 'SMS', content: msgJson.content });
    }
  });

  // process your message
  next()
});

// optional error listeners
smsWorker.on('error', function( err, msg ){
  console.log( "ERROR", err, msg.id );
});
smsWorker.on('exceeded', function( msg ){
  console.log( "EXCEEDED", msg.id );
});
smsWorker.on('timeout', function( msg ){
  console.log( "TIMEOUT", msg.id, msg.rc );
});

module.exports = smsWorker;
