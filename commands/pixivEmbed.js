const fetch = require('node-fetch');
let pixivIDRegex = /[0-9]{1,}/
const {MessageEmbed} = require('discord.js');

//this is only possible because of そら's work creating pixiv.moe.   https://github.com/kokororin

//again if someone is reading this, sorry for my shitty code

module.exports = {
    name: "pixivEmbed",
    aliases: [],
    description: "embeds pixiv links",
    guildOnly: false,
    requiresArgs: false,
    execute(message){

        /*first send the first image with pixiv.moe.image
        at the same time find if theres more images from pixiv itself if possible
        if there are more images send them from pixiv.moe*/

        let id = message.content.match(pixivIDRegex)[0];

        fetch(`https://www.pixiv.net/ajax/illust/${id}`)        
        .then(values => {    // do this stuff after the initial image is sent and you have the data from pixiv.net

            values.json().then(result => {

                let firstEmbed = new MessageEmbed();
                firstEmbed.setColor([135,164,183]);
                //firstEmbed.setImage(result.body.urls.original.replace(/https\:\/\//, 'https://boe-tea-pximg.herokuapp.com/'));
                firstImgId = result.body.urls.original.match(/https.*\/([0-9]*)\_*.*\.[a-z]{3}/)[1];
                firstEmbed.setImage('https://boe-tea-pximg.herokuapp.com/regular/'+firstImgId);

//                console.log(firstEmbed);

                message.channel.send(firstEmbed).then(firstImage => {
                    let numResults = result.body.pageCount;
                    if(numResults > 1)
                    {
                        firstImage.react('⏬');
                        if(numResults > 2){
                            message.channel.send(`There are **${numResults-1}** more images in this pixiv post. React with ⏬ (within 60 seoncds) to show up to 5 more`);
                        }else{
                            message.channel.send(`There is **1** more image in this pixiv post. React with ⏬ (within 60 seconds) to show it`);
                        }

                        const filter = (reaction, user) => reaction.emoji.name == '⏬' && !user.bot;
                        const collector = firstImage.createReactionCollector(filter, {time: 60000});

                        collector.once('collect', collected => {
                            //send the rest of the images
                            if(numResults>5)
                                numResults = 5;

                            imageLinks = "";
                            //console.log(numResults);

                            let msg = new MessageEmbed();
                            sendithImage(1);

                            function sendithImage(i){

                                if(i == numResults)
                                    return;
                                
                                msg.setTitle(`${i+1}/${numResults}`);
                                msg.setColor([135,164,183]);
                                //msg.setImage(result.body.urls.original.replace(/https\:\/\//, 'https://boe-tea-pximg.herokuapp.com/').replace(/_p0/, `_p${i}`));
                                msg.setImage('https://boe-tea-pximg.herokuapp.com/regular/'+firstImgId+`/${i}`);
                                message.channel.send(msg).then(something => {
                                    sendithImage(i+1);
                                });
                            }

                        });
                        collector.on('end', collected => {
                            //collector closed. unreact?
                        });
                    }

                })
            })



        })

    }


}
