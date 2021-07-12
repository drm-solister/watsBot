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
//        console.log(message);
//        console.log(message.content.match(testRE));
//        console.log(testRE.test(message.content));
        
//        if(spoilerRE.test(message.content))
//            console.log('that cointained a spoiler');
/*
        console.time("single image");
        fetch('https://api.pixiv.moe/image/91110599.png')
            .then((res) => {
                return res
            })
            .then((data) => {
        console.timeEnd("single image");
            });
*/
/*        console.time("proxy from pixiv link");
        fetch('https://api.pixiv.moe/image/i.pximg.net/img-master/img/2021/07/09/01/08/05/91110599_p0_master1200.jpg')
            .then((res) => {
                return res
            })
            .then((data) => {
        console.timeEnd("proxy from pixiv link");
            });
*/
    }
}