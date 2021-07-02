////invite link https://discord.com/oauth2/authorize?client_id=801269435830763570&scope=bot
//hell
const Discord = require("discord.js");
const cfg = require('../watsBotCfg.json');
const XMLHttpRequest = require('xmlhttprequest')//.XMLHttpRequest; ? does this go here? probably
const DOMParser = require('xmldom').DOMParser
const fs = require('fs');

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
    console.log('Logged in as ' + client.user.tag + '!');
    client.user.setPresence({ activity: { name: 'embeding twitter videos' }});
})



client.on('message', message => {
    if(!message.content.startsWith(cfg.prefix) || message.author.bot) return;

    const args = message.content.slice(cfg.prefix.length).split(/ +/);
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

    try{
        command.execute(message, args);
    }catch(err){
        console.log(err);
        message.channel.send("there was a problem using that command");
    }
})


// identifies twitter link and sends the message to twitterEmbed.js
let tweetRE = /[0-9]{19}/
client.on('message', message => {
    if(message.content.match(tweetRE) && !message.author.bot){
        command = client.commands.get('twitterEmbed');
        command.execute(message, bearerToken);
    }
})
