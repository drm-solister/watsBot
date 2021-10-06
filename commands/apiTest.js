const fetch = require('node-fetch');
let pixivIDRegex = /[0-9]{1,}/
const {MessageEmbed} = require('discord.js');

//this is only possible because of そら's work creating pixiv.moe.   https://github.com/kokororin

//again if someone is reading this, sorry for my shitty code

module.exports = {
    name: "apitest",
    aliases: [],
    description: "checks the response time for different api endpoints just because its convenient to do that with a bot i guess",
    guildOnly: false,
    requiresArgs: false,
    execute(message){
        let link = message.content.split(" ")[1];
        let id = message.content.match(pixivIDRegex)[0];
        

        // times the response time of the pixiv link normally
        console.time("timer1");
        fetch(link)
        .then((res) => {
             return //res.json();
        })
        .then((data) => {
            console.timeEnd("timer1");
        });

        // times the response of links like https://boe-tea-pximg.herokuapp.com/85256187
        console.time("timer2");
        fetch(`https://boe-tea-pximg.herokuapp.com/${id}`)
        .then((res) => {
             return //res.json();
        })
        .then((data) => {
            console.timeEnd("timer2");
        });        

        // times the response of links like https://boe-tea-pximg.herokuapp.com/regular/85256187
        console.time("timer3");
        fetch(`https://boe-tea-pximg.herokuapp.com/regular/${id}`)
        .then((res) => {
             return //res.json();
        })
        .then((data) => {
            console.timeEnd("timer3");
        });  

        // times the response of links like https://boe-tea-pximg.herokuapp.com/regular/85256187
        console.time("timer4");
        fetch(`http://api.pixiv.moe`)
        .then((res) => {
             return //res.json();
        })
        .then((data) => {
            console.timeEnd("timer4");
        });          


        console.log("-----------------------------");
    }
}