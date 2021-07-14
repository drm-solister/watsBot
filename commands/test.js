const fetch = require('node-fetch');
const fs = require('fs');



let testRE = /test/
let spoilerRE = /\|\|[a-zA-Z0-9_/.:?=]*\|\|/

module.exports = {
    name: "test",
    aliases: ['testing', 't'],
    description: "random testing stuff for the test branch",
    guildOnly: false,
    hidden: true,
    requireArgs: false,
    execute(message){



            let imageMsg = message.channel.messages.cache.filter(findImage);
            
            if(imageMsg.last() != undefined){
                console.log(imageMsg.last());
            }else{
                console.log('no result found');
            }

            function findImage(input) {
                if(input.embeds.length != 0)
                    return true;

                if(input.attachments.size != 0)
                    return true;

                return false;
            }

    }
}