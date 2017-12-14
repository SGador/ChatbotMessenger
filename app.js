require('dotenv').load();

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
  // Customize your Watson Middleware object's before and after callbacks.
  middleware.before = function(message, conversationPayload, callback) {
	//Passing values to conversation.
	console.log('Inside the before method.  messageB=' + JSON.stringify(message, 2, null));
	/*if(message.watsonData.intents[0].intent == 'goodbyes'){
	 console.log('Goodbye Intent Identified');
	}*/
    callback(null, conversationPayload);
  }

  middleware.after = function(message, conversationResponse, callback) {
	console.log("Attempting to respond");
    // *** Call to remote service here ***
	console.log('Inside the after method. messageB=' + JSON.stringify(message, 2, null));
    callback(null, conversationResponse);
  }
};