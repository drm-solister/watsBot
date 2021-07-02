const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const DOMParser = require('xmldom').DOMParser;
const {MessageAttachment} = require('discord.js')

// if someone is reading this im sorry i have no fucking clue how youre supposed to format code to make it readable. 

let tweetRE = /[0-9]{19}/
let spoilerRE = /\|\|[a-zA-Z0-9_/.:?=]*\|\|/

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
            if(parsedResponse['extended_entities']['media'][0]['type'] == 'video' || parsedResponse['extended_entities']['media'][0]['type'] == 'animated_gif'){

                if(parsedResponse['extended_entities']['media'][0]['type'] == 'video') //if its a video find the highest bitrate link
                    for(var i = 0; i<parsedResponse['extended_entities']['media'][0]['video_info']['variants'].length; i++){ 
                        if(parsedResponse['extended_entities']['media'][0]['video_info']['variants'][i].bitrate > largestBitrate){
                            largestBitrate = parsedResponse['extended_entities']['media'][0]['video_info']['variants'][i].bitrate;
                            largestBitrateIndex = i;
                        }
                    }

                if(parsedResponse['extended_entities']['media'][0]['type'] == 'animated_gif') //if its a gif there should only be one link
                    largestBitrateIndex = 0;

                if(spoilerRE.test(message.content)){
                    return; //it just wont send things if the link is spoilered because i cant think of a better way
//                    videoAttach = new MessageAttachment(parsedResponse['extended_entities']['media'][0]['video_info']['variants'][largestBitrateIndex].url, 'SPOILER_FILE.mp4');
//                    message.channel.send(videoAttach);
                }else{
                    message.channel.send(parsedResponse['extended_entities']['media'][0]['video_info']['variants'][largestBitrateIndex].url);
                }

            }

            return;

        }catch(err){
            console.log('invalid link, or missing twitter api token');
            console.log(HttpReq.responseText);
            return("invalid link");
        }

        })
        



    }   
} 