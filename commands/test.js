const fetch = require('node-fetch');
const fs = require('fs');
const {MessageEmbed} = require('discord.js');


let testRE = /test/
let spoilerRE = /\|\|[a-zA-Z0-9_/.:?=]*\|\|/

module.exports = {
    name: "test",
    aliases: ['testing', 't'],
    description: "random testing stuff for the test branch",
    guildOnly: false,
    requireArgs: false,
    execute(message){

            let msg = new MessageEmbed();
            msg.setTitle('benis');
            msg.setImage('https://api.pixiv.moe/image/i.pximg.net/img-original/img/2021/07/10/00/00/21/91130567_p2.jpg');
            message.channel.send(msg);

            //https://cdn.discordapp.com/attachments/482269726437933067/864318994744082493/02Good.jpg

    }
}