var express = require('express'),
https = require('https'),
path = require('path');
var app = express();
require('dotenv').load();
app.use('/images', express.static(path.join(__dirname, 'images')));
var clone = require('clone');
var storage = require('botkit-storage-mongo')({mongoUri:'mongodb://Marponsie:Password8732!@ds147882.mlab.com:47882/boiband', tables: ['userdata']});
var maxElapsedUnits = 3000;
console.log("Declared maxElapsedUnits: " + maxElapsedUnits + " seconds");
var userName;
var userLastName;
var userGender;
var fb_id;
var shoeBrand;
var shoeType;
var shoeColor;
var replyMessage;
var bodyParser = require('body-parser');
var verify = require('./security');

var cors = require('cors');
app.use(cors());
app.use(bodyParser.json({
  verify: verify
}));
app.post('/update', function (req, res) {

	  console.log("$$$$$$$$$$$$$$$$$$$ Received from Client Portal" + JSON.stringify(req.body) + "$$$$$$$$$$$$$$$$$$$");
/*	  console.log(req);
	  console.log("------------------------------------------------------");
	  console.log(res);*/
	  var userid = req.body.userId;
	  console.log(userid);
	  var Facebook = require('./bot-facebook');
	  if (Facebook.bot == null)
	    console.log("Facebook bot is null");
	 
	  /*if (Facebook.middleware == null){
	    console.log("Middleware is null");}
	  logs.view('log_user', 'by_userid', {
	    key: [userid], include_docs: true
	  }, function (err, res) {
	    if (!err) {*/
	     /*
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
	      }*/
	   /* }
	    else {
	      console.log(err);
	    }

	  });*/
	  res.set('X-Frame-Options','ALLOW-FROM https://kariteun-shopping.mybluemix.net/');
	  res.send('hello');
	  /*console.log("------------------------------------------------------");
	  console.log(res);*/
	});
var middleware = require('botkit-middleware-watson')({
  username: process.env.CONVERSATION_USERNAME,
  password: process.env.CONVERSATION_PASSWORD,
  workspace_id: process.env.WORKSPACE_ID,
  url: process.env.CONVERSATION_URL || 'https://gateway.watsonplatform.net/conversation/api',
  version_date: '2017-05-26'
});

module.exports = function(app) {
	  console.log('app.js');
	  console.log(JSON.stringify(app));
	  if (process.env.USE_FACEBOOK) {
	    var Facebook = require('./bot-facebook');
	    Facebook.controller.middleware.receive.use(middleware.receive);
	    Facebook.controller.createWebhookEndpoints(app, Facebook.bot);
	    console.log('Facebook bot is live');
	  }
	  function getFBusername(path, callback) {
		   console.log('getFbusername');
		    return https.get({
		        encoding: "utf8",
		        host: 'graph.facebook.com',
		        path: path
		    }, function(response) {
		        var body = '';
		        response.on('data', function(d) {
		            body += d;
		        });
		        response.on('end', function() {
		            var parsed = JSON.parse(body);
		            console.log("Parsed: " + JSON.stringify(parsed));
		            var firstname = parsed.first_name;
		            var lastname = parsed.last_name;
		            var user_gender = parsed.gender;
		            callback(firstname, lastname, user_gender);
		        });
		    });
		  }
	  function checkBalance(conversationResponse, callback) {
	    conversationResponse.context.user_name = userName;
	    conversationResponse.context.fbid = fb_id;
	    conversationResponse.context.user_lastname = userLastName;
	    conversationResponse.context.gender = userGender;
	    callback(null, conversationResponse);
	  }
	  middleware.before = function(message, conversationPayload, callback) {
	    console.log("Inside Before Method: " + JSON.stringify(conversationPayload));
	    replyMessage = clone(message);
	    var path = "/v2.10/"+message.user+"/?access_token="+process.env.FB_ACCESS_TOKEN;
	    getFBusername(path, function(firstname, lastname, user_gender){
	      console.log("getFBusername");
	      console.log("FB firstname "+ firstname +"\n");
	      userName = firstname;
	      userLastName = lastname;
	      userGender = user_gender;
	      console.log("userName: " + userName);
	      console.log("userLastName: " + userLastName);
	      console.log("userGender: " + userGender);
	    });
	    storage.channels.get(message.channel, function(err,data){
	      if(err){
	        console.log("Warning: error retrieving channel: " + message.channel + " is: " + JSON.stringify(err));
	      } else {
	        if(!data || data === null){
	          data = {id: message.channel};
	        }

	        console.log("Successfully retrieved conversation history...");

	        if(data && data.date) {
	          var lastActivityDate = new Date(data.date);
	          var now = new Date();
	          var secondsElapsed = (now.getTime() - lastActivityDate.getTime())/1000;
	          console.log("Max Elapsed Units: " + maxElapsedUnits);
	          console.log("Seconds Elapsed: " + secondsElapsed);
	          if(secondsElapsed > maxElapsedUnits) {
	            console.log("Should end the conversation.");
	            Facebook.endConversation(message);
	          } else {
	            console.log("Continue conversation");
	          }
	        }
	      }
	    });
	    var lastActivityTime = new Date();
	    console.log("Date: " + JSON.stringify(lastActivityTime));
	    storage.channels.save({id: message.channel, date: lastActivityTime}, function(err) {
	      if(err){
	        console.log("Warning: error saving channel details: " + JSON.stringify(err));
	      }
	      else{
	        console.log("Success saving channel detail. Save Date");
	      }
	    });
	    callback(null, conversationPayload);
	  };

	  middleware.after = function(message, conversationResponse, callback) {
	    console.log("Inside After Method: " + JSON.stringify(conversationResponse));
	    fb_id = message.user;
	    console.log("FB id of user: " + fb_id);
	    if(typeof conversationResponse !== 'undefined' && typeof conversationResponse.output !== 'undefined'){
	      if(conversationResponse.output.action === 'check_balance'){
	        return checkBalance(conversationResponse, callback);
	      }
	    }
	    var lastActivityTime = new Date();
	    console.log("Date: " + JSON.stringify(lastActivityTime));
	    storage.channels.save({id: message.channel, date: lastActivityTime, contextVar: conversationResponse.context}, function(err) {
	      if(err){
	        console.log("Warning: error saving channel details: " + JSON.stringify(err));
	      }
	      else{
	        console.log("Success saving channel detail. Save ContextVar");
	      }
	    });
	    callback(null, conversationResponse);
	  };
	};
	
	