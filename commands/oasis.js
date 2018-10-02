const Player = require("../models/player.js");
const mongoose = require("mongoose");

exports.run = async (client, message, args) => {
    
    if(!(message.guild.id.toString() === this.help.serverRestriction)) return console.log("Command called in an unallowed server.");
    
    mongoose.connect(client.config.db, {
        useNewUrlParser: true
    });
    
    let authorId, authorSr;

    try {
        authorId = message.author.id;
    } catch (err) {
        console.error("ERROR: " + err);
        return message.reply("something went wrong! Try that command again.");
    }

    const GoodQuotesObj = {
        "quote1": "Out of curiosity, how many OWL offers have you turned down?",
        "quote2": "I'm gonna need you to turn off your aimbot.",
        "quote3": "You should stop bullying mere mortals for your own amusement.",
        "quote4": "Evermore himself is jealous."
    };

    const GoodQuotes = Object.keys(GoodQuotesObj);
    
    console.log("Searching for instances of userid " + authorId.toString() + " to read.");
    Player.findOne( {userId: authorId} , 
                       (err, player) => {
        if(err) {
            console.error(err);
            return message.reply("I could not read the database!");
        }
        if (!player) {
            return message.reply("I can't assuage your ego if you're not in the database!");
                
        } else {
            authorSr = Math.ceil((player.skillRating * 1.420) / 100) * 100;
            return message.reply("your true SR is **" + Math.min(4969, authorSr + 69).toString() + "**! " + GoodQuotesObj[GoodQuotes[GoodQuotes.length * Math.random() << 0]]);
        }  
    });
};

exports.help = {
    name: "oasis",
    usage: "o!oasis",
    description: "Let OW Queue Bot's Very Complicated Algorithm tell you where you really belong.",
    serverRestriction: "184804980794851328"
}