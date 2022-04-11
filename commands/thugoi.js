
const Discord = require("discord.js");

module.exports = {
    name: "thugoi",
    aliases: [],
    description: "thuuuuuuuuuuuuuuuugoi",
    guildOnly: false,
    requireArgs: false,
    execute(message){
        message.channel.send({
            files: ['https://cdn.discordapp.com/attachments/480798157224017943/859188352769851462/image0.png']
        })
        return;
    }
}