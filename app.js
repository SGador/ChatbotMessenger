require('dotenv').load();
var clone = require('clone');
var storage = require('./brix_dep/botkit-storage-mongo')({mongoUri:'mongodb://Marponsie:Password8732!@ds147882.mlab.com:47882/boiband'});
var fname;

var middleware = require('botkit-middleware-watson')({
  username: process.env.CONVERSATION_USERNAME,
  password: process.env.CONVERSATION_PASSWORD,
  workspace_id: process.env.WORKSPACE_ID,
  url: process.env.CONVERSATION_URL || 'https://gateway.watsonplatform.net/conversation/api',
  version_date: '2017-05-26'
});

module.exports = function(app) {
	  if (process.env.USE_FACEBOOK) {
	    var Facebook = require('./bot-facebook');
	    Facebook.controller.middleware.receive.use(middleware.receive);
	    Facebook.controller.createWebhookEndpoints(app, Facebook.bot);
	    console.log('Facebook bot is live');
	  }
	  function getFBusername(path, callback) {
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
	            callback(firstname);
	        });
	    });
	  }
	  function checkBalance(conversationResponse, callback) {
	    conversationResponse.context.user_name = userName;
	    conversationResponse.context.fbid = fb_id;
	    callback(null, conversationResponse);
	  }
	  middleware.before = function(message, conversationPayload, callback) {
	    console.log("Inside Before Method: " + JSON.stringify(conversationPayload));	    
	    var path = "/v2.10/"+message.user+"/?access_token="+process.env.FB_ACCESS_TOKEN;
	    getFBusername(path, function(firstname){
	      console.log("FB firstname "+ firstname +"\n");
	      userName = firstname;
	      console.log("User Name in getFBusername: " + userName);
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
	            //end conversation
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

	    if(typeof conversationResponse !== 'undefined' && typeof conversationResponse.output !== 'undefined'){
	      if(conversationResponse.output.action === 'save_full_record'){
	        console.log("Retrieveing context data for SAVE FULL RECORD");
	      }
	    }
	    callback(null, conversationResponse);
	  };
	};