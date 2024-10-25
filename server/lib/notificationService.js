const db = require('../models');
const smsLib = require('./smsLib');
var amqp = require('amqplib');
var connection = amqp.connect('amqps://xybbnory:MBCBmo6JXTLPiVGMSOaQLSFmZWT8zMPP@stingray.rmq.cloudamqp.com/xybbnory');
var smsQueueName = 'sms';

module.exports = {
  sendSmsDataToQueue: function(claim){
    let smsTo = claim.phone1;
    if(claim.phone1 == null || claim.phone1 == ''){
      smsTo = claim.phone2;
    }
    const queueData = {contractNo: claim.contractNo, toClaimStatusId: claim.claimStatusId, to: smsTo};
    const query = { where: { toClaimStatus: claim.claimStatusId, active: 1 } };
    db.Notification.findAll(query).then(function (notification) {
      if (notification) {
        module.exports.sendDataToSmsQueue(queueData);
      }
    });
  },
  sendDataToSmsQueue: function(data) {
    connection.then(function(conn) {
      var ok = conn.createChannel();
      ok = ok.then(function(ch) {
        ch.assertQueue(smsQueueName, {autoDelete: true, durable: true});
        ch.sendToQueue(smsQueueName, new Buffer(JSON.stringify(data)));
      });
      return ok;
    }).then(null, console.warn);
  },
  sendNotificationSms: function(data) {
    const toClaimStatus = data.toClaimStatusId;
    const to = data.to;
    const contractNo = data.contractNo;
    const query = { where: { toClaimStatus: toClaimStatus, active: 1 } };

    db.Notification.findAll(query).then(function (notification) {
      if (!notification) {
        res.status(200).json({ error: 'No notification returned!' });
      } else {
        const content = notification[0].content.replace(/{contractNo}/g, contractNo);
        smsLib.sendSMS(to, content, function () {
          db.Claim.findAll({
                             where: {
                               contractNo: contractNo
                             }
                           }).then(function(claims) {
            if(claims) {
              const claimId = claims[0].id;
                               db.Audit.create({
                                                 module: 'claim',
                                                 function: 'sms',
                                                 userId: req.user.id,
                                                 context: JSON.stringify(data),
                                                 claimId: claimId
                                               });
                             }
          });
        });
      }
    });
  },
  readAndExecuteDataFromSmsQueue: function() {
    connection.then(function(conn) {
      var ok = conn.createChannel();
      ok = ok.then(function(ch) {
        ch.assertQueue(smsQueueName, {autoDelete: true, durable: true});
        ch.consume(smsQueueName, function(msg) {
          if (msg !== null) {
            var content = JSON.parse(msg.content);
            module.exports.sendNotificationSms(content);
            ch.ack(msg);
          }
        });
      });
      return ok;
    }).then(null, console.warn);
  }
};
