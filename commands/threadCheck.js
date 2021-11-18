
module.exports = {
    name: "threadCheck",
    aliases: ['thread', 'jointhread'],
    description: "if the bot missed a thread or didnt have access to a channel when the thread was created, use this command",
    guildOnly: true,
    hidden: false,
    requireArgs: false,
    execute(message){

        let joinedAll = true;

        message.channel.threads.fetchActive().then((activeThreads) => {
            activeThreads.threads.forEach( thread => {
                if(!thread.joined)
                {
                    message.channel.send(`Joining ${thread.name}`);
                    thread.join();
                    joinedAll = false;
                }
            });
            if(joinedAll)
                return message.channel.send("I have already joined all available threads in this channel");
        })
    }
}