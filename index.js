const Discord = require("discord.js");
const cfg = require('../watsBotCfg.json');
const XMLHttpRequest = require('xmlhttprequest')//.XMLHttpRequest; ? does this go here? probably
const DOMParser = require('xmldom').DOMParser
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(command => command.endsWith('.js'));


for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}


try {
    client.login(cfg.token);
}catch(err){
    client.login(process.env.token);
}


client.on('ready', () => {
    console.log('Logged in as ' + client.user.tag + '!');
    client.user.setActivity("w.embed [enable/disable]");
})

//prefixed message handler, disable for now i guess

client.on('message', message => {
    if(!message.content.startsWith(cfg.prefix) || message.author.bot) return;
})


// identify twitter link with regex

client.on('message', message => {
    if(message.content.includes('twitter.com/'))
        message.reply("twitter link identified")
})