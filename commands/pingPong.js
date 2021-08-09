
module.exports = {
    name: "pingPong",
    aliases: ['ping'],
    description: "simple ping pong to check delay, except its wildly innacurate because it compares my computer clock to discord clock",
    guildOnly: false,
    hidden: false,
    requiresArgs: false,
    execute(message){
        let firstTime = message.createdTimestamp;
        let currentTime = new Date();

        message.channel.send(`Pong! (${currentTime.getTime()-firstTime}ms)`);

    }
} 