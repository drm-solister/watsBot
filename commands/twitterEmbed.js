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

        var parsedResponse = JSON.parse(HttpReq.responseText);

        try{
            if(parsedResponse['entities']['media'][0]['media_url'].includes('ext_tw_video') || parsedResponse['entities']['media'][0]['media_url'].includes('amplify_video_thumb')){
                if(parsedResponse['extended_entities']['media'][0]['video_info']['variants'].slice(-1)[0]['bitrate']!=null){
                    message.channel.send(parsedResponse['extended_entities']['media'][0]['video_info']['variants'].slice(-1)[0]['url']);
                }else{
                    message.channel.send(parsedResponse['extended_entities']['media'][0]['video_info']['variants'].slice(-2)[0]['url']);
                }
                console.log(HttpReq.responseText);
            }else{
                console.log('its a twitter post but its not a video');
                console.log(HttpReq.responseText);
            }

            return

        }catch(err){
            console.log('invalid link, or missing twitter api token');
            console.log(HttpReq.responseText);
            return("invalid link");
        }

        })
        



    }   
} 