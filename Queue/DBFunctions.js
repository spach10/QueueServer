'use strict'

var DBFunctions = function(){
	var mysql = require('mysql');
	var bpromise = require('bluebird');

	this.connectToDB = function(){
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

	this.insertPreData = function(conn, data){
		return new bpromise(function(resolve, reject){
			var query = conn.query("INSERT INTO work_items ('work_item_id', 'work', 'domain') VALUES (null, '" + data.work + "', '"+data.domain+"');" , function (error, results) {
				if(error){
					reject(error);
				}else{
					resolve(results);
				}
			});
		});
	}

	this.insertPostData = function(conn, data){
		return new bpromise(function(resolve, reject){
			var query = conn.query("INSERT INTO work_results (`work_results_id`, `work_item_id`, 'work_item', 'work_results') VALUES (null, '" + data.work_item_id + "', '"+data.work_item+"', '"+data.work_results+"');" , function (error, results) {
				if(error){
					reject(error);
				}else{
					resolve(results);
				}
			});
		});
	}
}

module.exports = DBFunctions;