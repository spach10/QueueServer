var amqp = require('amqplib/callback_api');
var DBFunctions = require('../DBFunctions.js');
require('dotenv').config();
var DB = new DBFunctions();

amqp.connect('amqp://' + process.env.mquser + ':' + process.env.mqpassword + '@' + process.env.host , function(err, amqpconn) {
  amqpconn.createChannel(function(err, ch) {
    var q = 'eyething';

    ch.assertQueue(q, {durable: true});
    ch.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
    }).finally(function() {
        conn.end();
        ch.ack(msg);
    }); 
  }, {noAck: false});
});