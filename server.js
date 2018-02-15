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

app.listen(port, function() {
  console.log('Client server listening on port ' + port);
});

app.post('/update', function (req, res) {

	  console.log("$$$$$$$$$$$$$$$$$$$ Received from Client Portal" + JSON.stringify(req.body) + "$$$$$$$$$$$$$$$$$$$");
	  console.log("------------------------------------------------------");
	  var userid = req.body.psid;
	  var ts = req.body.timestamp;
	  console.log(req.body.orderData);
	  var Facebook = require('./bot-facebook');
	  if (Facebook.bot == null){
	    console.log("Facebook bot is null");
	  }
	  if (Facebook.middleware == null){
	    console.log("Middleware is null");
	  }
	  var msg = {};
	  msg = {"text":"<watson> transaction confirmation","channel":userid,"user":userid,"timestamp":ts,"orderdata":req.body.orderData};

      Facebook.middleware.sendToWatsonAsync(Facebook.bot, msg).then(function () {
        Facebook.processWatsonResponse(Facebook.bot, msg);
      })
	  res.set('X-Frame-Options','ALLOW-FROM https://kariteun-shopping.mybluemix.net/');
	  res.send('200 Transaction Complete');
	  console.log("------------------------------------------------------");
	});