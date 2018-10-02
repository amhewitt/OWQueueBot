exports.run = async (client, message, args) => {
    if (!args[0]) {
        const cmdNames = client.commands.keyArray();
        let output = `\`\`\`Command List\`\`\`\n`
        let command = "";
        cmdNames.forEach (c => {
            command = client.commands.get(c);
            if (command.help.serverRestriction === "none" || command.help.serverRestriction === message.guild.id.toString()) {
                output += `- ${client.config.prefix}${command.help.name}\n`;
            }
        });
        output += `\nFor more information, use \`${client.config.prefix}help <command>\`.`;
        message.channel.send(output);
    } else  {
        let command = args[0];
        if (client.commands.has(command)) {
            command = client.commands.get(command);
            if (command.help.serverRestriction === "none" || command.help.serverRestriction === message.guild.id.toString()) {
                message.channel.send(`\`\`\`= ${command.help.name} =\`\`\` \nDescription: ${command.help.description}\nUsage: \`${command.help.usage}\``);
            }
        } else  {
            message.reply("that command doesn't exist!")
        }
    }
};

exports.help = {
    name: "help",
    usage: "o!help, o!help <command>",
    description: "Lists all commands that OWQueueBot can do. You can also specify a command for more information on how to use it.",
    serverRestriction: "none"
}