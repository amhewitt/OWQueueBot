const Player = require("../models/player.js");
const mongoose = require("mongoose");

exports.run = async (client, message) => {
    mongoose.connect(client.config.db, {
        useNewUrlParser: true
    });
    
    let authorId, authorSr;

    try {
        authorId = message.author.id;
    } catch (err) {
        console.error("ERROR: " + err);
        return message.reply("something went wrong! Try that command again.")
    }
    
    console.log("Searching for instances of userid " + authorId.toString() + " to read.");
    Player.findOne( {userId: authorId} , 
                       (err, player) => {
        if(err) {
            console.error(err);
            return message.reply("I could not read the database!");
        }
        if (!player) {
            return message.reply("I can't report your SR if you're not in the database!");
                
        } else {
            authorSr = player.skillRating;
            return message.reply("I have your current SR recorded as **" + authorSr.toString() + "**! If this is not currently correct, consider running \`o!update\`.")
        }  
    }); 
};

exports.help = {
    name: "sr",
    usage: "o!sr",
    description: "Returns your current SR as it exists in the database.",
    serverRestriction: "none"
}