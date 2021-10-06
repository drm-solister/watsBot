//const fetch = require('node-fetch');
const cfg = require('../../watsBotCfg.json');
const fetch = require('node-fetch');
const sagiri = require('sagiri');
const sagiriClient = sagiri(cfg.sauceNAOKey);


httpRE = /http[s]*:\/\//

module.exports = {
    name: "sauce",
    aliases: ['saucenao', 'reversesearch', 's'],
    description: "reverse image searching. either send the command with a link (w.sauce [link]), or it will search for the last image thats been sent in the channel",
    guildOnly: false,
    requireArgs: true,
    execute(message, args){
        //console.log(`https://saucenao.com/search.php?db=999&output_type=2&testmode=1&numres=16&url=${message.content}`);

//        console.log(args);


        if(args.length == 0){ //there are no args, reverse image search the last message sent in the channel
            
            
            let imageMsg = message.channel.messages.cache.filter(findImageMsg);

            function findImageMsg(input) {
                if(input.embeds.length != 0)
                    return true;

                if(input.attachments.size != 0)
                    return true;

                return false;
            }

            let imgUrl;

            if(imageMsg.last() != undefined){
//                console.log(imageMsg.last());
                if(imageMsg.last().embeds.length != 0){
                    imgUrl = imageMsg.last().embeds[0].url;
                }else{
                    imgUrl = imageMsg.last().attachments.first().url;
                }
            }else{
                return rejection('No images sent recently. (Or bot reset recently)');
            }

            message.channel.send(`Reverse image searching...`);

            sagiriClient(imgUrl).then(result, rejection);



        }else{  //if there is a link in the argument, reverse image search that link

            if(!httpRE.test(args))
                return message.channel.send('Not a link (must start with http)');

            sagiriClient(args[0]).then(result, rejection);

        }



        function result(data) {
//            console.log(data);
            message.channel.send(data[0].url);
        }
        
        function rejection(data) {
            console.log('There was an error');
            if(data.message != null)
                return message.channel.send(data.message);
            
            return message.channel.send(data);
        }


    }
}

// need to limit the size of the cache, i dont want it storing every single message right
// add ability to reply to an image to reverse search