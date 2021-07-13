const fetch = require('node-fetch');


let testRE = /test/
let spoilerRE = /\|\|[a-zA-Z0-9_/.:?=]*\|\|/

module.exports = {
    name: "test",
    aliases: ['testing', 't'],
    description: "random testing stuff for the test branch",
    guildOnly: false,
    requireArgs: false,
    execute(message){

        fetch('https://www.pixiv.net/ajax/illust/91079778').then(result => {
            result.json().then(parsed => {
                let link = parsed.body.urls.original.replace(/https\:\/\//, 'https://api.pixiv.moe/image/');
                console.log(link);
            });
        });

        //  https://www.pixiv.net/en/artworks/86471275

    }
}