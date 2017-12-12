'use strict'

var DBFunctions = function() {
	var mysql = require('mysql');
	var bpromise = require('bluebird');

	this.connectToDB = function() {
		console.log("inside db connection");
		var connection = mysql.createConnection({
  			host     : process.env.host,
  			user     : process.env.user,
  			password : process.env.password,
  			database : 'work_queue'
		});
		connection.connect();
		return connection;
	}

	this.disconnectDB = function(connection){
		connection.end();
	}

	this.insertPreData = function(conn, data) {
		return new bpromise(function(resolve, reject) {
			var query = conn.query("INSERT INTO work_items (`work_item_id`, `work`, `domain`) VALUES (null, '" + JSON.stringify(data[0]) + "', '"+ JSON.stringify(data[1].domain) +"');" , function (error, results) {
			console.log("Error: " + error + "     Result: " + results);			
				if(error) {
					reject(error);
				} else {
					resolve(results);
				}
			});
		});
	}
}

module.exports = DBFunctions;
