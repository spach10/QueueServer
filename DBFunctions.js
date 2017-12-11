'use strict'

var DBFunctions = function(){
	var mysql = require('mysql');
	var bpromise = require('bluebird');

	this.connectToDBpreprocess = function(){
		var connection = mysql.createConnection({
  			host     : process.env.host,
  			user     : process.env.user,
  			password : process.env.password,
  			database : 'data_queue'
		});

		connection.connect();
		return connection;
	}

	this.connectToDBpostprocess = function(){
		var connection = mysql.createConnection({
  			host     : process.env.host,
  			user     : process.env.user,
  			password : process.env.password,
  			database : 'data_storage'
		});

		connection.connect();
		return connection;
	}

	this.disconnectDB = function(connection){
		connection.end();
	}

	this.insertPreData = function(conn, data){
		return new bpromise(function(resolve, reject){
			var query = conn.query("INSERT INTO data_temp (`id`, `data`, `uniqId`, `insertDatetime`) VALUES (null, '" + data + "', null, SYSDATE());" , function (error, results) {
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
			var query = conn.query("INSERT INTO data_temp (`id`, `data`) VALUES (null, '" + data + "');" , function (error, results) {
				if(error){
					reject(error);
				}else{
					resolve(results);
				}
			});
		});
	}

	this.pullData = function(conn, id){
		return new bpromise(function(resolve, reject){
			var query = conn.query("SELECT data FROM data_temp WHERE id=" + id + ";" , function (error, results) {
				if(error){
					reject(error);
				}else{
					resolve(results);
				}
			});
		});
	}

	this.checkDBForPreProcessData = function(conn, uniqId){
		return new bpromise(function(resolve, reject){
			var query = conn.query("SELECT COUNT(*) FROM data_temp WHERE uniqId = '" + id + "';" , function (error, results) {
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