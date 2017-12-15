/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Botkit = require('botkit');

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

//comment sa visual studio code
//return bot.startConversation(message, 'Hello there, good looking fellow.');
bot.say('Hello Fellow!');
var message = 'test';
bot.startTyping(message, function () {
	  // do something here, the "is typing" animation is visible
	});

	bot.stopTyping(message, function () {
	  // do something here, the "is typing" animation is not visible
	});

	bot.replyWithTyping(message, 'Hello there, my friend!');
controller.hears('goodbyes', 'message_received', middleware.hear, function(bot,message) {
	bot.reply(message, message.watsonData.output.text.join('\n'));	
});

controller.hears('(.*)', 'message_received', function(bot, message) {
	var shoeType = message.match[0]; //message.match[1] to select the match
	if(shoeType === 'Nike'){
		return bot.reply (message, 'Nike it is!');
	}
	console.log("Controller Hears!!!");
	bot.reply(message, message.watsonData.output.text.join('\n'));
});

//controller.api.messenger_profile.domain_whitelist('https://noodoprojyekuto.mybluemix.net/');
//controller.api.messenger_profile.home_url({
//    "url": 'https://noodoprojyekuto.mybluemix.net/',
//    "webview_height_ratio": 'tall',
//    "in_test": false
//});

module.exports.controller = controller;
module.exports.bot = bot;