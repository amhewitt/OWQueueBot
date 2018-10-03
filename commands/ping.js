exports.run = async (client, message) => {
    if(!(message.guild.id.toString() === this.help.serverRestriction)) return console.log("Command called in an unallowed server.");
    message.channel.send('pong').catch(console.error);
};

exports.help = {
    name: "ping",
    usage: "o!ping",
    description: "A debugging command for sanity reasons. Does nothing other than reply 'pong'. It's very useful, I assure you.",
    serverRestriction: "457362793188950016"
}