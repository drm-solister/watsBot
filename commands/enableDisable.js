
module.exports = {
    name: "enableDisable",
    aliases: ['enable', 'disable'],
    description: "enable or disable automatic functions, i.e. pixiv or twitter video embed",
    guildOnly: false,
    requireArgs: true,
    execute(message, args){
        let argument = args[0];
        let channelPreferences = args[1];

        let currChannel = channelPreferences[message.channel];

        if(message.content.includes("enable")) { // clean this up to use less indexing, specificially channelPref[message.channe;]
            
            if (currChannel == undefined || channelPreferences[message.channel].indexOf(argument) == -1)
                return message.channel.send(`The ${argument} function was not disabled`);

            argIndex = channelPreferences[message.channel].indexOf(argument);
            channelPreferences[message.channel] = channelPreferences[message.channel].slice(0, argIndex) + channelPreferences[message.channel].slice(argIndex+argument.length)
            console.log(`new channel preferences for channel ${message.channel}: ${channelPreferences[message.channel]}`);


        } else if (message.content.includes("disable")) {
            console.log(currChannel);
            if (currChannel == undefined) { // the channel isnt on the list
                channelPreferences.push({channelID: message.channel.id})
                channelPreferences.at(-1).preferences += argument; // will always be the last index
                console.log(`disabled the ${argument} function`)
                console.log(channelPreferences);
            }
        }
        return;
    }
}