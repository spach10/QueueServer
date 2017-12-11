var amqp = require('amqplib/callback_api');
var DBFunctions = require('./DBFunctions.js');
var PythonShell = require('python-shell');
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
      var conn = DB.connectToDBpreprocess();
      DB.pullData(conn, msg.content).then(function(result){
        var options = {
          mode: 'text',
          pythonPath: '/bin/python',
          pythonOptions: ['-u'],
          scriptPath: './',
          args: [result]
        };

        PythonShell.run('dummy_processing.py', options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
        });
      }).finally(function(){
        conn.end();
        ch.ack(msg);
      });
      
      
    }, {noAck: false});
  });
});