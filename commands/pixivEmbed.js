const fetch = require('node-fetch');
let pixivIDRegex = /[0-9]{1,}/

//this is only possible because of そら's work creating pixiv.moe.   https://github.com/kokororin

module.exports = {
    name: "pixivEmbed",
    aliases: [],
    description: "embeds NON R18 pixiv links",
    guildOnly: false,
    requiresArgs: false,
    execute(message){

        /*first send the first image with pixiv.moe.image
        at the same time find if theres more images from pixiv itself if possible
        if there are more images send them from pixiv.moe*/

        let id = message.content.match(pixivIDRegex)[0];

        const promise1 = fetch(`https://www.pixiv.net/ajax/illust/${id}`);

        const promise2 = message.channel.send(`https://api.pixiv.moe/image/${id}.png`);


        // do this stuff after the initial image is sent and you have the data from pixiv.net
        Promise.all([promise1, promise2]).then(values => {

            values[0].json().then(result => {
                let numResults = result.body.pageCount;
                if(numResults > 1)
                {
                    values[1].react('⏬');
                    if(numResults > 2){
                        message.channel.send(`There are **${numResults-1}** more images in this pixiv post. React with ⏬ to show them (will show 5 max)`);
                    }else{
                        message.channel.send(`There is **1** more image in this pixiv post. React with ⏬ to show it`);
                    }

                    const filter = (reaction, user) => reaction.emoji.name == '⏬' && !user.bot;
                    const collector = values[1].createReactionCollector(filter, {time: 20000});

                    collector.on('collect', collected => {
                        //send the rest of the images
                        if(numResults>5)
                            numResults = 5;

                        imageLinks = "";
                        console.log(numResults);

                        for(let i = 1; i<=(numResults); i++){
                            //imageLinks += `https://api.pixiv.moe/image/${id}-${i}.jpg\n`;
                            imageLinks += result.body.urls.original.replace(/https\:\/\//, 'https://api.pixiv.moe/image/').replace(/_p0/, `_p${i}`) + '\n';
                        }

                        message.channel.send(imageLinks);

                    });
                    collector.on('end', collected => {
                        //collector closed. unreact?
                    });
                }
            })



        })

    }


}

//to do - the embeds from pixiv.moe are too slow, get the links that act as a proxy from pixiv later