const Player = require("../models/player.js");
const mongoose = require("mongoose");

exports.run = async (client, message) => {
    mongoose.connect(client.config.db, {
        useNewUrlParser: true
    });

    let authorId;
    
    try {
        authorId = message.author.id;
    } catch (err) {
        console.error("ERROR: " + err);
        return message.reply("something went wrong! Try that command again.");
    }
    
    console.log("Searching for instances of userid " + authorId.toString() + " to remove.");
    Player.findOne( {userId: authorId} , 
                       (err, player) => {
        if(err) {
            console.error(err);
            return message.reply("I could not read the database!");
        }
        if (!player) {
            return message.reply("I can't remove you if you're not in the database!")
                
        } else {
            console.log("Removing all instances of user with user id " + authorId + " from the database.");
            Player.deleteMany ( {userId: authorId}, (err) => {
                if (err) {
                    console.error(err);
                    return message.reply("something went wrong while deleting!");
                }
                console.log("Remove successful.");
                return message.reply("you have been removed successfully!");
            });
        }  
    }); 
};

exports.help = {
    name: "remove",
    usage: "o!remove",
    description: "Removes yourself from the database. If you are signed up under more than one server, all instances of you will be removed.",
    serverRestriction: "none"
}