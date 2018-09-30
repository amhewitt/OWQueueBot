module.exports = async client => {
    console.log(`${client.user.tag} is currently interacting with ${client.users.size} users in ${client.guilds.size} servers.\n***`);
    client.user.setActivity(`in ${client.guilds.size} servers`, {type: 'PLAYING'});
};