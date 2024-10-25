const REDIS_HOST = 'ec2-34-250-57-15.eu-west-1.compute.amazonaws.com';
const REDIS_USER = 'h';
const REDIS_PORT = '19959';
const REDIS_PASSWORD = 'p89fe7db0b8c8aea2f88ada628c24cd1a0881a4b6cd18fc66f3683dac9b19645e';

let rsmq = require("rsmq");
//let notificationBroker = new rsmq({ host: "localhost", port: 6379, ns: "rsmq" });
let notificationBroker = new rsmq({ host: REDIS_HOST, port: REDIS_PORT, ns: "rsmq", password: REDIS_PASSWORD });
const DEFAULT_DELAY_PARAMETER = 30;

module.exports = {

  create_queue: async (queueName) => {
    try {
      response = await notificationBroker.createQueueAsync({qname: queueName,});
      if (response === 1 ) {
        console.log("Queue created", response);
      }
    } catch (err) {
      if (err.name == 'queueExists')
        console.log(" DQueue Exists")

      else ("redis error" )
    }
  },

  send_data_to_queue: async (queueName, data) => {
    try {

      let delayParam = DEFAULT_DELAY_PARAMETER;
      if(data.delay != null){
        delayParam = data.delay;
      }

      response = await notificationBroker.sendMessageAsync({qname: queueName, message: data, delay: delayParam});
      if (response) {
        console.log("Message sent. ID:", response);
      }
    } catch (err) {
      console.log(err);
    }
  }

}
