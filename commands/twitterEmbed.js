const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const DOMParser = require('xmldom').DOMParser;



var url = "http://google.com"
//let tweetRE = new RegExp(@"\d{10}");
let tweetRE = /[0-9]{19}/


module.exports = {
    name: "twitterEmbed",
    aliases: [],
    description: "provides a direct link to a twitter video",
    guildOnly: false,
    requiresArgs: false,
    execute(message, token){

        var tweetID = (message.content.match(tweetRE)[0]);
        var twitterEndpoint = 'https://api.twitter.com/1.1/statuses/show.json?id=' + tweetID

        var HttpReq = new XMLHttpRequest();
        HttpReq.open('GET', twitterEndpoint);
        HttpReq.setRequestHeader('Authorization', 'Bearer ' + token);
        HttpReq.send();
        HttpReq.addEventListener('load', () => {
            
        try{
            if(JSON.parse(HttpReq.responseText)['entities']['media'][0]['media_url'].includes('ext_tw_video')){
                message.channel.send(JSON.parse(HttpReq.responseText)['extended_entities']['media'][0]['video_info']['variants'][2]['url']);
            }else{
                console.log('its a twitter post but its not a video');
            }

            return

        }catch(err){
            console.log('invalid link');
            return("invalid link");
        }

        })
        



    }   
} 