var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var pics = require('./pics.js');
var request = require('request');
var ora = require('ora');
var colors = require('colors');
var cheerio = require('cheerio');
var googleIt = require('google-it');
var googleimages = require('google-images');
var { fetchSubreddit, pretty, fetchRandomSubredditName, fetchRandomNSFWSubredditName } = require('fetch-subreddit');

//google.resultsPerPage = 5;
var nextCounter = 0;



var opts = {
  maxResults: 1,
  key: 'key'
};



function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}




// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    bot.setPresence( { game: { name:'type !bb' } });

});





bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
		args_string = args.join(' ');
        switch(cmd) {
		// !kkona
            case 'kkona':
			console.log('Executing command kkona');
			var max_length2 = pics.songs.length - 1;
			var randomint2 = randomIntFromInterval(0, max_length2);
                bot.sendMessage({
                    to: channelID,
                    message: '!play ' + pics.songs[randomint2]
                });
			break;
		//roll
			case 'roll':
			console.log('Executing command roll');
			if(args.length > 0) {
			var interval = parseInt(args[0], 10);
			if(isNaN(interval) || interval < 0 || interval == 0){
			bot.sendMessage({
				to: channelID,
				message: 'Error must be a number and not negative \nUse with !roll <specified interval> \nStandard interval is 100'
			});
			break;
			}
			var roll2 = randomIntFromInterval(1, interval);
			bot.sendMessage({
				to: channelID,
				message: ':game_die: ' + user + ' rolls ' + roll2 + ' :game_die: (1 - ' + interval + ')'
			});
			break;
			}
			var roll = randomIntFromInterval(1, 100);
			bot.sendMessage({
				to: channelID,
				message: ':game_die: ' + user + ' rolls ' + roll + ' :game_die:'
			});
			break;
			//wow
			case 'wow':
			console.log("Executing command item");
			var fullquery = 'wowhead' + args.join(" ");
			var link;
			googleIt({'query': fullquery}).then(results => {
				link = results[0].link;
				bot.sendMessage({	
					to: channelID,
					message: link
				});
			  }).catch(e => {
				console.log(e);
			  })

			break;
			case 'bb':
			console.log('Executing command bb');
			bot.sendMessage({
				to: channelID,
				message: 'All commands must start with \'!\' \n wow <query> - search in wow database \n kkona - random kkona song \n roll - rolls the dice \n google <query> - google something \n dank - get a dank meme \n pic <query> - search for a picture of something'
			});
			break;
			case 'google':
			console.log('Executing command google');
			if(args.length == 0) {
			bot.sendMessage({
				to: channelID,
				message: 'Need something to google.'
			});
			}
			bot.sendMessage({
				to: channelID,
				message: 'Googling \"' + args_string + '\"...'
			});
			var fullquery = args.join(" ");
			var link;
			googleIt({'query': fullquery}).then(results => {
				// access to results object here
				//console.log(results);
				link = results[0].link;
				bot.sendMessage({	
					to: channelID,
					message: link
				});
			  }).catch(e => {
				// any possible errors that might have occurred (like no Internet connection)
				console.log(e);
			  })


			break;
			
			case 'dank':
			console.log('Executing command dank');
			fetchSubreddit('dankmemes')
			.then((urls) => console.log(pretty(urls)))
			.catch((err) => console.error(err));
			function pretty(obj) {
			var randomInt = randomIntFromInterval(1, 26);
			subreddit_link = obj[0].urls[randomInt];
			bot.sendMessage({
				to: channelID,
				message: subreddit_link
			});
				}
			break;
			case 'help':
			bot.sendMessage({
				to: channelID,
				message: 'Type !bb to see all available commands.'
			});
			
			break;
			case 'pic':
			var client = new googleimages('google images api token', 'google images api token');
			console.log('Executing command google pics');
			if(args.length == 0) {
			bot.sendMessage({
				to: channelID,
				message: 'Need something to google'
			});
			}
			else if(args.length >= 1) {
			var pic;
			client.search(args_string).then(images =>  {
				pic = images[0].url;
			bot.sendMessage({
				to: channelID,
				message: pic
			});
			});
			}
			}
	}
});