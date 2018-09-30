const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const Enmap = require("enmap");
const fs = require("fs");
const mongoose = require("mongoose");
mongoose.connect(config.db, {
    useNewUrlParser: true
});

client.config = config;

fs.readdir("./events", (err, files) => {
    if (err) return console.error(err);
    
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
    });
});

client.commands = new Enmap();

fs.readdir("./commands", (err, files) => {
    if (err) return console.error(err);
    
    files.forEach(file => { 
        if (!file.endsWith(".js")) return;
        // mac lul
        
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        console.log(`Loading command ${commandName}`);
        client.commands.set(commandName, props);
    });
});

client.login(config.token);