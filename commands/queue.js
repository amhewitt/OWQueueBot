const Player = require("../models/player.js");
const mongoose = require("mongoose");

/* declared up here because blizzard likes to change thresholds >_> */
const GMThreshold = 350;
const MasterThreshold = 500;
const Threshold = 1000;

exports.run = async (client, message, args) => {
    mongoose.connect(client.config.db, {
        useNewUrlParser: true
    });
    const authorId = message.author.id;
    const authorServerId = message.guild.id;
    
    if(!args[0]) {
        
        let match = {};
        let userSr;
        let lowerBound, upperBound;
        
        console.log("Searching for userid " + authorId.toString() + " in guild " + authorServerId.toString() + ".");
        Player.findOne( {userId: authorId , serverId: authorServerId} , 
                       (err, player) => {
            if (err) {
                console.log(err);
                return message.reply("I could not read the database!");
            }
        
            if (!player) {
                return message.reply("You're not in the database. Please run \`o!init\` or \`o!help init\` before using this command.");
            } else {
                userSr = player.skillRating;
                
                // BIG IF ENERGY
                
                if (userSr < 2500) {
                    upperBound = userSr + Threshold;
                    lowerBound = userSr - Threshold;
                } else if (userSr < 3000) {
                    upperBound = 3499;
                    lowerBound = userSr - Threshold;
                } else if (userSr < 3500) {
                    upperBound = userSr + MasterThreshold;
                    lowerBound = userSr - Threshold;
                } else if (userSr < 3650) {
                    upperBound = 3999;
                    lowerBound = userSr - MasterThreshold;
                } else if (userSr < 4000) {
                    upperBound = userSr + GMThreshold;
                    lowerBound = userSr + MasterThreshold;
                } else {
                    upperBound = userSr + GMThreshold;
                    lowerBound = userSr - GMThreshold;
                }
                
                console.log("Searching for matches in " + authorServerId.toString() + " between " + lowerBound.toString() + " and " + upperBound.toString() + ".");
                Player.find( { skillRating: { $gte: lowerBound, $lte: upperBound } , userId : { $ne: authorId } , serverId: authorServerId }, (err, players) => {
                    if (err) {
                        console.log(err);
                        return message.reply("I could not read the database!");
                    }
                    
                    if (!players[0]) {
                        return message.reply("I could not find anyone in the database that you can queue with!");
                    } else {
                        let output = ("I found the following players you can queue with:\n");
                        for (let pl of players) {
                            output += pl.battleNet + ": " + pl.skillRating.toString() + " SR";
                        }
                        return message.reply(output);
                    }
                });
            }
        });
        
        
    } else {
        
        let otherBtag = args[0];
        // btags must be at least 3 characters long
        // thus the earliest a # can appear is at index 3
        if (otherBtag.indexOf("#") <= 2) return message.reply("that's not a battletag!");
        let userSr, otherSr;
        
        console.log("Searching for userid " + authorId.toString() + " and guild " + authorServerId.toString() + ".");
        Player.findOne( {userId: authorId, serverId: authorServerId} , 
                       (err, player) => {
            if (err) {
                console.log(err);
                return message.reply("I could not read the database!");
            }
        
            if (!player) {
                return message.reply("You're not in the database. Please run \`o!init\` or \`o!help init\` before using this command.");
            } else {
                btag = player.battleNet;
                if (btag === otherBtag) return message.reply("you can obviously queue with yourself!");
                
                userSr = player.skillRating;
                
                console.log("Searching for matches for " + otherBtag.toString() + " in guild " + authorServerId.toString() + ".");
                Player.findOne( {battleNet: otherBtag, serverId: authorServerId}, 
                               (err, otherPlayer) => {
                    const compareFail = "you and " + otherBtag + " are too far in SR!";
                    const compareSuccess = "you and " + otherBtag + " are able to queue together!"
                    
                    if (err) {
                        console.log(err);
                        return message.reply("I could not read the database!")
                    }
                    
                    if (!otherPlayer) {
                        return message.reply("that player isn't in the database!")
                    } else {
                        otherSr = otherPlater.skillRating;
                        
                        if (userSr >= 4000 || otherSr >= 4000) {
                            return abs(userSr - otherSr) > GMThreshold ? message.reply(compareFail) : message.reply(compareSuccess);
                        } else if (userSr >= 3500 | otherSr >= 3500) {
                            return abs(userSr - otherSr) > MasterThreshold ? message.reply(compareFail) : message.reply(compareSuccess);
                        } else {
                            return abs(userSr - otherSr) > Threshold ? message.reply(compareFail) : message.reply(compareSuccess);
                        }
                    }
                });
            }
            
        });
    }
};

exports.help = {
    name: "queue",
    usage: "o!queue, o!queue [battletag]",
    description: "Returns a list of all the users in the database that you can queue with. If a battletag is specified, returns whether or not you can queue with that specific person, if they exist in the database. First time users should see o!init first."
}