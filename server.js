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
	  console.log(req);
	  console.log("------------------------------------------------------");
	  console.log(res);
	  var userid = req.body.userId;
	  var Facebook = require('./bot-facebook');
	  if (Facebook.bot == null)
	    console.log("Facebook bot is null");
	 
	  if (Facebook.middleware == null){
	    console.log("Middleware is null");}
	  /*logs.view('log_user', 'by_userid', {
	    key: [userid], include_docs: true
	  }, function (err, res) {
	    if (!err) {
	     
	      if (res.rows.length != 0) {
	        console.log("Go here" + res.rows.length);
	        function sortByTimestamp(a,b)
	        {
	          return ((a.value.message.timestamp < b.value.message.timestamp) ? 1 : ((a.value.message.timestamp > b.value.message.timestamp) ? -1 : 0));
	        }
	        var sortedArray = (res.rows).sort(sortByTimestamp);
	       
	        var msg = sortedArray[0].value.message;
	        console.log("The text is "+ msg.text +"The timestamp is "+ msg.timestamp);
	        msg.text = 'received from client portal';
	        
	        
	          Facebook.processWatsonResponse(Facebook.bot, msg);
	      }
	    }
	    else {
	      console.log(err);
	    }

	  });*/
	  res.set('X-Frame-Options','ALLOW-FROM https://kariteun-shopping.mybluemix.net/');
	  res.send('hello');
	  console.log("------------------------------------------------------");
	  console.log(res);
	});