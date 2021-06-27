
module.exports = {
    name: "pingPong",
    aliases: ['ping'],
    description: "simple ping pong to check delay i guess",
    guildOnly: false,
    requiresArgs: false,
    execute(message){
        let firstTime = message.createdTimestamp;
        let currentTime = new Date();

        message.channel.send(`Pong! (${currentTime.getTime()-firstTime}ms)`);

    }
} 