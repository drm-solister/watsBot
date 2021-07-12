const fetch = require('node-fetch');

let pixivIDRegex = /[0-9]{1,}/

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
                    message.channel.send(`There are **${numResults}** images in this pixiv post. React with ⏬ to show the rest (will show 5 max)`);

                    const filter = (reaction, user) => reaction.emoji.name == '⏬' && !user.bot;
                    const collector = values[1].createReactionCollector(filter, {time: 20000});

                    collector.on('collect', collected => {
                        //send the rest of the images
                        if(numResults>5)
                            numResults = 5;

                        imageLinks = "";
                        console.log(numResults);

                        for(let i = 2; i<=(numResults); i++){
                            imageLinks += `https://api.pixiv.moe/image/${id}-${i}.jpg\n`;
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