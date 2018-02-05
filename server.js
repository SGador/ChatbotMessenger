require('dotenv').load();

var express = require('express');
var bodyParser = require('body-parser');
var verify = require('./security');
var app = express();

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
	var userid = req.body.userid;
	var Facebook = require('./bot-facebook');
	console.log(userid);
	if(Facebook.bot==null){
		console.log("Facebook bot is null");
	}	
	if(Facebook.watsonMiddleware==null){
	}
	Facebook.watsonMiddleware.sendToWatsonAsync(Facebook.bot, "hello").then(function () {
        Facebook.processWatsonResponse(Facebook.bot, "hello");
      })
});