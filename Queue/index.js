
var express = require('express');
var DBFunctions = require('./DBFunctions.js');
// var amqp = require('amqplib/callback_api');
require('dotenv').config();

var DB = new DBFunctions();
// Constants
var PORT = 8081;

// App
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true, limit: '5mb'}));
app.use(bodyParser.json({limit: '5mb'}));

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.route('/receive-work/')

    // create a thing (accessed at POST http://localhost:8080/api/thing/create)
    .post(function(req, res) {
    	if (!req.body) 
    		return res.sendStatus(400);

        //TODO: Connect to mysql db and insert data then send message to rabbitMQ queue
    	console.log("before db");
        var conn = DB.connectToDB();
        console.log("connected to DB");
        console.log(req.body);
        DB.insertPreData(conn, req.body).then(function(result) {
        	console.log("inside of interPreData");
        	conn.end();
        	var open = requre("amqplib").connect('amqp://' + process.env.mquser + ':' + process.env.mqpassword + '@' + process.env.host);
	 		open.then(function(conn) {
 				return conn.createChannel();
 			}).then(function(ch) {
 				var queue = 'work';
	    		//Our message must be a string
	    		var msg = result.insertId.toString();
	    		ch.assertQueue(queue, {durable: true});
	    		ch.sendToQueue(queue, new Buffer(msg), {persistent: true});
	    		console.log(" [x] Sent '%s'", msg);
 			});
	 	}).catch(function(error){
				conn.end();
				res.end('Insert failed: ' + error);
		});
        res.end('Data Inserted. ID=' );
    });

router.route('/data/checkid/')

	//get route to check for a uniq id on the data
	.get(function(req, res){
		var conn = DB.connectToDBpreprocess(env);
        DB.checkDBForPreProcessData(conn, uniqID).then(function(result){
        	conn.end();
        	res.end(result);
        }).catch(function(err){
        	conn.end();
        	res.end('There was an error with your request: ' + err);
        });
        	
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.listen(PORT);