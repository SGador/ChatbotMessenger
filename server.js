require('dotenv').load();

var express = require('express');
var bodyParser = require('body-parser');
var verify = require('./security');
var app = express();
var clone = require('clone');
var cors = require('cors');
app.use(cors());
app.use(bodyParser.json({
  verify: verify
}));

var port = process.env.PORT || 3000;
app.set('port', port);

require('./app')(app);

// Listen on the specified port
app.listen(port, function() {
  console.log('Client server listening on port ' + port);
});

/*app.post('/update',function(req,res){
	console.log(JSON.stringify(req.body));
	var userid = req.body.psid;
	var Facebook = require('./bot-facebook');
	console.log("its dis")
	if(Facebook.bot==null){
		console.log("Facebook bot is null");
	}	
	if(Facebook.middleware==null){
		console.log("Middleware is null")
	}
	var msg = {};
	req.payload = 'hello';
	var test = {};
	test.req = req;
	test.res = res;
	app((req,res));
    //Facebook.processWatsonResponse(Facebook.bot, msg);
    res.send('200');
});*/

app.post('/update', function (req, res) {

	  console.log("$$$$$$$$$$$$$$$$$$$ Received from Client Portal" + JSON.stringify(req.body) + "$$$$$$$$$$$$$$$$$$$");
	  console.log("------------------------------------------------------");
	  var userid = req.body.userId;
	  console.log(userid);
	  var Facebook = require('./bot-facebook');
	  if (Facebook.bot == null){
	    console.log("Facebook bot is null");
	  }
	  if (Facebook.middleware == null){
	    console.log("Middleware is null");}
	  var msg = {};
	  msg.text = 'hello';
	  msg.channel = req.body.psid;
	  msg.user = req.body.psid;
	  msg.timestamp = req.body.timestamp;
	  msg.watsonData = {};
	  msg.watsonData.output = {};
	  //msg.watsonData.output = 'action';
	  msg.watsonData.output.action ={ generic_template: { title: 'Please choose', buttons: [ [Object], [Object] ] } };
	 
	 
	  Facebook.processWatsonResponse(Facebook.bot, msg);
	     
	  res.set('X-Frame-Options','ALLOW-FROM https://kariteun-shopping.mybluemix.net/');
	  res.send('hello');
	  console.log("------------------------------------------------------");
	});