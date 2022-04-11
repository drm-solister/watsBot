const { execSync } = require("child_process");
const { SystemChannelFlags } = require("discord.js");
const { system } = require("nodemon/lib/config");

module.exports = {
    name: "diag",
    aliases: ["diagnostic", "uptime", "status"],
    description: "system diagnostics and uptime",
    guildOnly: false,
    requiresArgs: false,
    execute(message){

        if(process.platform == "win32")
            return message.channel.send("Bot running on windows/testing machine")

        //let uptimeRegex = /up([a-zA-Z 1-9]*,[a-zA-Z1-9 :]*)/
        //let tempRegex = /=([0-9'.C]{1,})/

        let temp = execSync("/opt/vc/bin/vcgencmd measure_temp").toString().trim().match(tempRegex)[1]
        let uptime = execSync("uptime -p").toString().trim().slice(3)

        return message.channel.send(`Hardware uptime: ${uptime}\nSystem temperature: ${temp}`)


    }
}