const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const DOMParser = require('xmldom').DOMParser;

// if someone is reading this im sorry i have no fucking clue how youre supposed to format code to make it readable. 

let tweetRE = /[0-9]{19}/

module.exports = {
    name: "twitterEmbed",
    aliases: [],
    description: "provides a direct link to a twitter video",
    guildOnly: false,
    requiresArgs: false,
    execute(message, token){


        var tweetID = (message.content.match(tweetRE)[0]);
        var twitterEndpoint = 'https://api.twitter.com/1.1/statuses/show.json?id=' + tweetID + "&tweet_mode=extended&trim_user=1"

        var HttpReq = new XMLHttpRequest();
        HttpReq.open('GET', twitterEndpoint);
        HttpReq.setRequestHeader('Authorization', 'Bearer ' + token);
        HttpReq.send();
        HttpReq.addEventListener('load', () => {

        var parsedResponse = JSON.parse(HttpReq.responseText);
        var largestBitrate = 0;
        var largestBitrateIndex = -1;

        try{
            if(parsedResponse['entities']['media'][0]['media_url'].includes('ext_tw_video') || parsedResponse['entities']['media'][0]['media_url'].includes('amplify_video_thumb')){
                if(parsedResponse['extended_entities']['media'][0]['video_info']['variants'].length!=0)
                    for(var i = 0; i<parsedResponse['extended_entities']['media'][0]['video_info']['variants'].length; i++){ //find the video with the higest bitrate otherwise you might get a 640x480 vid or invalid link
//                        console.log(parsedResponse['extended_entities']['media'][0]['video_info']['variants'][i].bitrate);
                        if(parsedResponse['extended_entities']['media'][0]['video_info']['variants'][i].bitrate > largestBitrate){
                            largestBitrate = parsedResponse['extended_entities']['media'][0]['video_info']['variants'][i].bitrate;
                            largestBitrateIndex = i;
                        }
                    }
                message.channel.send(parsedResponse['extended_entities']['media'][0]['video_info']['variants'][largestBitrateIndex].url)
//                console.log(HttpReq.responseText);
            }else{
                console.log('its a twitter post but its not a video: ' + message.content);
//                console.log(HttpReq.responseText);
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