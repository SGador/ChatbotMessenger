var Botkit = require('botkit');
var clone = require('clone');
var storage = require('botkit-storage-mongo')({mongoUri:'mongodb://Marponsie:Password8732!@ds147882.mlab.com:47882/boiband', tables: ['userdata']});
var d = new Date();
d.setSeconds(5);
var maxElapsedUnits = d.getSeconds();
var endConvo = false;

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

 function endConversation(message){
	console.log("Trying to end conversation");
	endedCondition = true;
	console.log("End Condition: " + endedCondition);
	var endMessage = clone(message);
	endMessage.text = 'time out';
	middleware.interpret(bot, endMessage, function(){
		bot.reply(endMessage, endMessage.watsonData.output.text.join('\n'));
	});
	  console.log("Conversation ended");
}

var processWatsonResponse = function(bot, message){
	console.log("Just heard the following message: " + JSON.stringify(message));
	  if(message.watsonError){
	    console.log("Watson Error: " + JSON.stringify(message.watsonError));
	    console.log(message.watsonError);
	    return bot.reply(message, "I'm sorry, but for technical reasons I can't respond to your message");
	  }
	  if(endConvo == false) {
	    if(typeof message.watsonData.output !== 'undefined') {
	      bot.reply(message, message.watsonData.output.text.join('\n'));
	    }
	    if(message.watsonData.output.action === 'check_balance'){
	          var newMessage = clone(message);
	          newMessage.text = 'check new name';
	          middleware.interpret(bot, newMessage, function(){
	            bot.reply(newMessage, newMessage.watsonData.output.text.join('\n'));
	          });
	    }
	    if (message.watsonData.output.action && message.watsonData.output.action.generic_template) {
	        console.log("Generic template.");
	        setTimeout(function(){
	          var attachment = {
	          "type":"template",
	          "payload":{
	            "template_type":"generic",
	            "elements":[
	              {
	                "title":message.watsonData.output.action.generic_template.title,
	                "image_url":message.watsonData.output.action.generic_template.image,
	                "default_action": message.watsonData.output.action.generic_template.default_action,
	                "buttons":message.watsonData.output.action.generic_template.buttons
	              }
	            ]
	          }
	        }
	        bot.reply(message, {
	          attachment: attachment,
	        });
	      });
	    }
	    if (message.watsonData.output.action && message.watsonData.output.action.shoe_brand_only) {
	      console.log("Shoe Brand Only.");
	      setTimeout(function(){
	        var attachment = 
	        {
	          "type":"template",
	          "payload":
	          {
	            "template_type":"generic",
	            "elements":[
	              {
	                "title":message.watsonData.output.action.shoe_brand_only.title,
	                "image_url":message.watsonData.output.action.shoe_brand_only.image,
	                "default_action": message.watsonData.output.action.shoe_brand_only.default_action,
	                "buttons":message.watsonData.output.action.shoe_brand_only.buttons
	              }
	            ]
	          }
	       }
	       bot.reply(message, {
	          attachment: attachment,
	       });
	      });
	    }
	    if (message.watsonData.output.action && message.watsonData.output.action.display_yes_no) {
	      console.log("Shoe Brand Only.");	     
	      setTimeout(function(){
	        var attachment = 
	        {
	          "type":"template",
	          "payload":
	          {
	            "template_type":"button",
	            "elements":[
	              {
	                "title":message.watsonData.output.action.display_yes_no.title,
	                "buttons":message.watsonData.output.action.display_yes_no.buttons
	              }
	            ]
	          }
	       }
	       bot.reply(message, {
	          attachment: attachment,
	       });
	      });
	    }
	  }
	  endConvo = false;
};
controller.on('message_received', processWatsonResponse);
controller.on('facebook_postback', function(bot, message){
	  console.log("Trying to respond to facebook postback");
	  bot.reply(message, message.payload);
});
module.exports.controller = controller;
module.exports.bot = bot;
module.exports.endConversation = endConversation;