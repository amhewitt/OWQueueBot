exports.run = async (client, message, args) => {
    message.channel.send('pong').catch(console.error);
};

exports.help = {
    name: "ping",
    usage: "o!ping",
    description: "A debugging command for sanity reasons. Does nothing other than reply 'pong'. It's very useful, I assure you."
}