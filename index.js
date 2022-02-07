////invite link https://discord.com/oauth2/authorize?client_id=801269435830763570&scope=bot
//hell
const Discord = require("discord.js");
const cfg = require('../watsBotCfg.json');
const XMLHttpRequest = require('xmlhttprequest')//.XMLHttpRequest; ? does this go here? probably
const DOMParser = require('xmldom').DOMParser
const fs = require('fs');
const readline = require('readline');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(command => command.endsWith('.js'));

//              reads the command folder and adds all commands to a Discord.Collection
for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

//              tries to login with a token (if im running it locally) or an environmental variable if its on a server
try {
    client.login(cfg.token);
}catch(err){
    client.login(process.env.token);
}

//              tries to get twitter API token from my local files or environmental variable otherwise
var bearerToken;
try {
    bearerToken = cfg.bearerToken;
}catch(err){
    client.login(process.env.bearerToken);
}



client.on('ready', () => {
    console.log('Logged in as ' + client.user.tag + ' at ' + new Date().toTimeString() + '!');
    client.user.setPresence({ activity: { name: 'embeding twitter videos' }});
})


// recieves all messages
client.on('message', message => {

    if(!message.guild.me.permissionsIn(message.channel.id).has('SEND_MESSAGES')){
        let currentDate = new Date()
        console.log("i dont have permission to send messages in channel " + message.channel.name + " at " + currentDate.toTimeString() + " on " + currentDate.toDateString());
        return;
    }

    //conditions that may not be explicit commands go before the command parsing
    if(message.content.toLowerCase().startsWith("padoru padoru"))
        return message.channel.send(padoru());

    if(!message.content.startsWith(cfg.prefix) || message.author.bot) return;

    const args = message.content.toLowerCase().slice(cfg.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if(!command) return;
    
    if(command.requiresArgs && !args.length)
    {
        let reply = "This command requires arguments.";
        if(command.usage)
            reply+= "\nUsage of this command is: " + command.usage;
        message.channel.send(reply);
        return;
    }

    if(args == 'help')
        return message.channel.send(command.description);

    try{
        command.execute(message, args);
    }catch(err){
        console.log(err);
        message.channel.send("there was a problem using that command");
    }
})

// this probably should have been a function thats called inside the first message event listener so that I wouldn't have two event listeners
// identifies twitter link and sends the message to twitterEmbed.js
let tweetRE = /twitter\.com\/.*\/[0-9]{18,20}/
let pixivRegex = /www\.pixiv\.net[\/en]*\/artworks\/[0-9]*/
client.on('message', message => {

    if(message.author.bot)
        return;

    if(message.content.match(tweetRE)){
        
        if(!message.guild.me.permissionsIn(message.channel.id).has('SEND_MESSAGES')){
            console.log("i dont have permission to send messages in channel " + message.channel.name);
            return;
        }

        command = client.commands.get('twitterEmbed');
        command.execute(message, bearerToken);
    }

    if(message.content.match(pixivRegex)){

        if(!message.guild.me.permissionsIn(message.channel.id).has('SEND_MESSAGES')){
            console.log("i dont have permission to send messages in channel " + message.channel.name);
            return;
        }

        command = client.commands.get('pixivEmbed');
        command.execute(message,bearerToken);
    }
})


// padoru command only
function padoru(){
    if(typeof linksTxt == "undefined"){
        linksTxt = [];
        fs.readFileSync('padorus.txt', 'utf-8').split(/\r?\n/).forEach(function(line){
            linksTxt.push(line);
          });
    }

    return linksTxt[Math.floor(Math.random()*linksTxt.length)];
}
