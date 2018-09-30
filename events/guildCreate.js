module.exports = (client, guild) => {
    console.log(`I have been added to guild ${guild.name} (id ${guild.id}).`);
    client.user.setActivity(`in ${client.guilds.size} servers`, {type: 'PLAYING'});
    console.log(`${client.user.tag} is currently interacting with ${client.users.size} users in ${client.guilds.size} servers.\n***`);
}