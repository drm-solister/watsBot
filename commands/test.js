
let testRE = /test/
let spoilerRE = /\|\|[a-zA-Z0-9_/.:?=]*\|\|/

module.exports = {
    name: "test",
    aliases: ['testing', 't'],
    description: "random testing stuff for the test branch",
    guildOnly: false,
    requireArgs: false,
    execute(message){
        console.log(message);
//        console.log(message.content.match(testRE));
//        console.log(testRE.test(message.content));
        
//        if(spoilerRE.test(message.content))
//            console.log('that cointained a spoiler');
    }
}