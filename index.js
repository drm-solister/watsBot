////invite link https://discord.com/oauth2/authorize?client_id=801269435830763570&scope=bot
//hell
const Discord = require("discord.js");
const cfg = require('../watsBotCfg.json');
const XMLHttpRequest = require('xmlhttprequest')//.XMLHttpRequest; ? does this go here? probably
const DOMParser = require('xmldom').DOMParser
const fs = require('fs');
const readline = require('readline');
const {generate, parse, transform, stringify} = require('csv/sync');

const myIntents = new Discord.Intents([Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS]);

const client = new Discord.Client({ intents: myIntents});
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(command => command.endsWith('.js'));

//              reads the command folder and adds all commands to a Discord.Collection
for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

//              get channel preferences from csv file channelPreferences.csv
let channelPreferences;
try {
    const myCsv = fs.readFileSync('../channelPreferences.csv');
    channelPreferences = parse(myCsv, {columns: ['channelID', 'preferences'], skipEmptyLines: true});

} catch(err) {
    console.log(err);
    console.log("The channel preferences csv does not exist, generating now.");
    fs.writeFileSync('../channelPreferences.csv', "");
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
    console.log('Logged in as ' + client.user.tag + ' at ' + new Date().toString() + '!');
    client.user.setPresence({ activity: { name: 'embeding twitter videos' }});
})


// recieves all messages
client.on('messageCreate', message => {

    if(!message.guild.me.permissionsIn(message.channel.id).has('SEND_MESSAGES')){
        console.log("i dont have permission to send messages in channel " + message.channel.name + " at " + new Date().toString());
        return;
    }

    //conditions that may not be explicit commands go before the command parsing
    if(message.content.toLowerCase().startsWith("padoru padoru"))
        return message.channel.send(padoru());

    if(!message.content.startsWith(cfg.prefix) || message.author.bot) return;

    let args = message.content.toLowerCase().slice(cfg.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if(!command) return;
    
    if(command.requiresArgs && !args.length) // why doesnt this work?
    {
        let reply = "This command requires arguments.";
        if(command.usage)
            reply+= "\nUsage of this command is: " + command.usage;
        message.channel.send(reply);
        return;
    }

    // special cases if args == help or command == enableDisable
    if(args == 'help')
        return message.channel.send(command.description);

    if(command.name == "enableDisable") {
        args = [args, channelPreferences];
    }

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
client.on('messageCreate', message => {

    if(message.author.bot)
        return;

    //currentChannelPreferences = channelPreferences[channelPreferences.findIndex(x => x.channelID == message.channel.id)].preferences;

    // [pixivOK, twitterOK] = [true, true];
    // if(currentChannelPreferences.indexOf('twitter') == -1)
    //     twitterOK = false;

    // if(currentChannelPreferences.indexOf('pixiv') == -1)
    //     pixivOK = false;

    // if (channelPreferences[message.channel]) {
    //     twitterOk = (channelPreferences[message.channel].indexOf("twitter") != -1);
    //     pixivOk = (channelPreferences[message.channel].indexOf("pixiv") != -1);
    // }
    //let twitterOK = (currentChannelPreferences.indexOf('twitter') == -1);
    //let pixivOK = (currentChannelPreferences.indexOf('pixiv') == -1)

    if(message.content.match(tweetRE)){

        currentChannel = channelPreferences[channelPreferences.findIndex(x => x.channelID == message.channel.id)];
        if (currentChannel != undefined && currentChannel.preferences.indexOf('twitter') != -1)
            return
        
        if(!message.guild.me.permissionsIn(message.channel.id).has('SEND_MESSAGES')){
            console.log("i dont have permission to send messages in channel " + message.channel.name);
            return;
        }

        command = client.commands.get('twitterEmbed');
        command.execute(message, bearerToken);
    }

    if(message.content.match(pixivRegex)){

        currentChannel = channelPreferences[channelPreferences.findIndex(x => x.channelID == message.channel.id)];
        if (currentChannel != undefined && currentChannel.preferences.indexOf('pixiv') != -1)
            return

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

// leagueShame command only
// let guilds;
// client.on('ready', () => {
//     client.guilds.fetch().then(result => {
//         guilds = result
//         leagueShame()
//     })
// })

// function leagueShame(){
//     client.commands.get('leagueShame').execute(client, guilds);

//     setTimeout( () => {leagueShame()}, 5000)
// }

// join all new threads
client.on('threadCreate', threadChannel => {
    threadChannel.join()
})