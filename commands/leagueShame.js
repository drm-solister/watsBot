module.exports = {
    name: "leagueShame",
    aliases: [],
    description: "dont get caught playing league of legends",
    guildOnly: false,
    requiresArgs: false,
    execute(client, guilds){
        console.log(client.uptime)
        //for (guild in client.guilds)
         //   console.log(guild)

        guilds.each(guild => guild.fetch().then(result => {
            console.log(result.name)
            result.members.list().then(result2 => {
                result2.each(member => console.log(member.displayName))
            })      // for some reason its only getting one user from each server. is there a neater way to 
                    // nest promises?
        }))
    }
}