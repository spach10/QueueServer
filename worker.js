
var DBFunctions = require('./DBFunctions.js');
require('dotenv').config();
var DB = new DBFunctions();

// Open connection with RabbitMQ
var q = "work";
var open = require("amqplib").connect('amqp://' + process.env.mquser + ':' + process.env.mqpassword + '@' + process.env.host);
open.then(function(conn) {
  console.log("RabbitMQ connection successful");
  return conn.createChannel();
})
// Consumer
.then(function(ch) {
  return ch.assertQueue(q).then(function(ok) {
    return ch.consume(q, function(msg) {
      if (msg !== null) {
        console.log(msg.content.toString());


        ch.ack(msg);
      }
    });
  });
}).catch(console.warn);