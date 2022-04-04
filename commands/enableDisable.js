// this is fragile because the commands are just tossed into the csv as concatenated strings, not discrete.
// fine the way it is though because the only possible commands are "twitter" and "pixiv", no overlap between them

const fs = require('fs');
const {stringify, generate} = require('csv');
const objectsToCsv = require('objects-to-csv');


module.exports = {
    name: "enableDisable",
    aliases: ['enable', 'disable'],
    description: "enable or disable automatic commands, i.e. pixiv or twitter video embed",
    guildOnly: false,
    requireArgs: true,
    execute(message, args){

        let automaticCommands = ["twitter", "pixiv"];

        let argument = args[0][0];
        let channelPreferences = args[1];

        // console.log(channelPreferences);
        // console.log("------------------");

        if (automaticCommands.indexOf(argument) == -1)
            return message.channel.send(`${argument} is not an automatic command`);
        
        [currChannel, currChannelIndex] = [undefined, undefined];
        if (channelPreferences != undefined) {
            currChannelIndex = channelPreferences.findIndex(x => x.channelID == message.channel.id); // findIndex is expensive
            currChannel = channelPreferences[currChannelIndex];
        }
        console.log(`currentChannel:`);
        console.log(currChannel);

        if(message.content.includes("enable")) { 
            
            if (currChannel == undefined || currChannel.preferences.indexOf(argument) == -1)
                return message.channel.send(`The ${argument} command was not disabled`);

            argIndex = currChannel.preferences.indexOf(argument);
            currChannel.preferences = currChannel.preferences.slice(0, argIndex) + currChannel.preferences.slice(argIndex+argument.length)
            //console.log(`new channel preferences for channel ${message.channel}: ${channelPreferences[message.channel]}`);
            // write to file
            console.log((new objectsToCsv(channelPreferences.slice(1))).toDisk('../channelPreferences.csv').then( result => {
                console.log(result);
            }));

            message.channel.send(`Enabled the ${argument} command`);


        } else if (message.content.includes("disable")) {

            if (currChannel == undefined) { // the channel isnt on the list
                //console.log("currChannel is undefined. see channelPreferences:");
                //console.log(channelPreferences);
                channelPreferences.push({channelID: message.channel.id})
                channelPreferences.at(-1).preferences = argument; // will always be the last index
                //channelPreferences = [{channelID: (message.channel.id), preferences: argument}];
                message.channel.send(`Disabled the ${argument} command`);
                console.log((new objectsToCsv(channelPreferences.slice(1))).toDisk('../channelPreferences.csv').then( result => {
                    console.log(result);
                }));
                return;
            }

            // console.log("curr channel!!!!!!");
            // console.log(currChannel);
            indexOfArgument = currChannel.preferences.indexOf(argument)
            if (indexOfArgument != -1) {
                message.channel.send(`The ${argument} command was already disabled in this channel`);
            }

            if (indexOfArgument == -1) {
                channelPreferences.at(currChannelIndex).preferences += argument;
                // console.log("channelPreferences: !!!!");
                // console.log(channelPreferences);
                message.channel.send(`Disabled the ${argument} command`);
                console.log((new objectsToCsv(channelPreferences.slice(1))).toDisk('../channelPreferences.csv').then( result => {
                    console.log(result);
                }));
            }

        }
    }
}


//  update everything better. add help command to show all commands. yea