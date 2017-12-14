
var DBFunctions = require('./DBFunctions.js');
require('dotenv').config();
var shell = require("shelljs");
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

        // Needs sshpass installed to grab the .apk from the Agent
          var sourceDomain = "mobileautomation@mobileautomation11.xactware.com";
          var sourceFilePath = "../../Applications/buildAgent/work/Android_USRelease/archive.zip";
          var destPath = "~/Desktop/archive/";
          if (shell.exec('sshpass -e scp '+ sourceDomain +':'+ sourceFilePath + ' ' + destPath)
                  .code !== 0) {
              // Error transferring .apk file.
              shell.echo("there was an error in here");
          }

        ch.ack(msg);
      }
    });
  });
}).catch(console.warn);