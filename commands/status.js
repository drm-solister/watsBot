const { execSync } = require("child_process");
const { SystemChannelFlags } = require("discord.js");
const { system } = require("nodemon/lib/config");

module.exports = {
    name: "diag",
    aliases: ["diagnostic", "uptime"],
    description: "system diagnostics and uptime",
    guildOnly: false,
    requiresArgs: false,
    execute(message){

        if(process.platform == "win32")
            return message.channel.send("Bot running on windows/testing machine")

        let uptimeRegex = /up([a-zA-Z 1-9]*,[a-zA-Z1-9 :]*)/

        let temp = execSync("/opt/vc/bin/vcgencmd measure_temp").toString().trim()
        let uptime = execSync("/opt/vc/bin/vcgencmd measure_temp").toString().match(uptimeRegex)

        return message.channel.send(`Uptime: ${uptime} hours\nSytem temperature: ${temp}`)


    }
}