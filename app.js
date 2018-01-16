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
  
  storage.users.get('11111', function(error, beans){
	    fname = beans.firstname;
	  });

	  // Customize your Watson Middleware object's before and after callbacks.
	  middleware.before = function(message, conversationPayload, callback) {
	    console.log("First Name: " + JSON.stringify(fname));
	    console.log("Inside Before Method: " + JSON.stringify(conversationPayload));
	    callback(null, conversationPayload);
	  };

	  middleware.after = function(message, conversationResponse, callback) {
	    if(typeof conversationResponse !== 'undefined' && typeof conversationResponse.output !== 'undefined'){
	      if(conversationResponse.output.action === 'check_balance'){
	        return checkBalance(conversationResponse, callback);
	      }
	    }
	    console.log("Inside After Method: " + JSON.stringify(conversationResponse));
	    callback(null, conversationResponse);
	  };
 
};