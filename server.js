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

app.post('/update',function(req,res){
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
//	var msg = {};
//	msg.text = 'hello';
	var msg = clone(app.middleware.before);
	console.log(JSON.replyMessage);
	//var msg = app.replyMessage;
	console.log(JSON.stringify(msg));
	//msg.watsonData.output = 'hello';
    Facebook.processWatsonResponse(Facebook.bot, msg);
    res.send('200');
});