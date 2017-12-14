
var express = require('express');

// Constants
var PORT = 8081;

// App
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true, limit: '5mb'}));
app.use(bodyParser.json({limit: '5mb'}));

app.post('10.61.133.173:8081/api/',function(req,res){
    var user_name=req.body.user;
    var password=req.body.password;
    console.log("User name = "+user_name+", password is "+password);
    res.end("yes");
});

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.route('/receive_run_results/')

    // create a thing (accessed at POST http://localhost:8080/api/thing/create)
    .post(function(req, res) {
    	if (!req.body)
            return res.sendStatus(400)
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.listen(PORT);