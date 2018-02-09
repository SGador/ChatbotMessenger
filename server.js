require('dotenv').load();

var express = require('express');
var bodyParser = require('body-parser');
var verify = require('./security');
var app = express();
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
	var msg;
	msg.text = 'hello';
	//msg.watsonData.output = 'hello';
    Facebook.processWatsonResponse(Facebook.bot, JSON.stringfy(msg));
    res.send('200');
});