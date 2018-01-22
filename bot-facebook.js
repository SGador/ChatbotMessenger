var Botkit = require('botkit');
var clone = require('clone');

var middleware = require('botkit-middleware-watson')({
	  username: process.env.CONVERSATION_USERNAME,
	  password: process.env.CONVERSATION_PASSWORD,
	  workspace_id: process.env.WORKSPACE_ID,
	  url: process.env.CONVERSATION_URL || 'https://gateway.watsonplatform.net/conversation/api',
	  version_date: '2017-05-26'
	});

var controller = Botkit.facebookbot({
  access_token: process.env.FB_ACCESS_TOKEN,
  verify_token: process.env.FB_VERIFY_TOKEN
});

var bot = controller.spawn();

var processWatsonResponse = function(bot, message){
 if(message.watsonError){
    return bot.reply(message, "I'm sorry, but for technical reasons I can't respond to your message");
  }
    if(typeof message.watsonData.output !== 'undefined') {
    bot.reply(message, message.watsonData.output.text.join('\n'));
    }
};
controller.on('message_received', processWatsonResponse);
module.exports.controller = controller;
module.exports.bot = bot;