require('dotenv').load();
var clone = require('clone');
var storage = require('./brix_dep/botkit-storage-mongo')({mongoUri:'mongodb://Marponsie:Password8732!@ds147882.mlab.com:47882/boiband'});
var fname;

function checkBalance(conversationResponse, callback) {
	  conversationResponse.context.user_name = fname;
	  callback(null, conversationResponse);
}


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

  middleware.before = function(message, conversationPayload, callback) {
	console.log("Inside Before Method: " + JSON.stringify(conversationPayload));
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

	callback(null, conversationPayload);
 };

  middleware.after = function(message, conversationResponse, callback) {
	  if(typeof conversationResponse !== 'undefined' && typeof conversationResponse.output !== 'undefined'){
		  if(conversationResponse.output.action === 'check_balance'){
	        return checkBalance(conversationResponse, callback);
	      }
	  }
	  console.log("Inside After Method: " + JSON.stringify(conversationResponse));
	  var lastActivityTime = new Date();
	  console.log("Date: " + JSON.stringify(lastActivityTime));

	  storage.channels.save({id: message.channel, date: lastActivityTime}, function(err) {
		  if(err){
			  console.log("Warning: error saving channel details: " + JSON.stringify(err));
	      }else{
	          console.log("Success saving channel detail.");
	      }
});

callback(null, conversationResponse);
};
};