const Player = require("../models/player.js");
const mongoose = require("mongoose");
const GMThreshold = 350;
const MasterThreshold = 500;
const Threshold = 1000;

exports.run = async (client, message, args) => {
    mongoose.connect(client.config.db, {
        useNewUrlParser: true
    });

    let authorId, authorServerId;

    try {
        authorId = message.author.id;
        authorServerId = message.guild.id;
    } catch (err) {
        console.error("ERROR: " + err);
        return message.reply("something went wrong! Try that command again.")
    }
   
    if(!args[0]) {
        
        let userSr;
        let lowerBound, upperBound;
        
        console.log("Searching for userid " + authorId.toString() + " in guild " + authorServerId.toString() + ".");
        Player.findOne( {userId: authorId , serverId: authorServerId} , 
                       (err, player) => {
            if (err) {
                console.error(err);
                return message.reply("I could not read the database!");
            }
        
            if (!player) {
                return message.reply("You're not in the database. Please run \`o!init\` or \`o!help init\` before using this command.");
            } else {
                userSr = player.skillRating;
                
                if (userSr < (3500 - Threshold)) {
                    upperBound = userSr + Threshold;
                    lowerBound = userSr - Threshold;
                } else if (userSr < (3500 - MasterThreshold)) {
                    upperBound = 3499;
                    lowerBound = userSr - Threshold;
                } else if (userSr < 3500) {
                    upperBound = userSr + MasterThreshold;
                    lowerBound = userSr - Threshold;
                } else if (userSr < (4000 - GMThreshold)) {
                    upperBound = 3999;
                    lowerBound = userSr - MasterThreshold;
                } else if (userSr < 4000) {
                    upperBound = userSr + GMThreshold;
                    lowerBound = userSr - MasterThreshold;
                } else {
                    upperBound = userSr + GMThreshold;
                    lowerBound = userSr - GMThreshold;
                }
                
                console.log("Searching for matches in " + authorServerId.toString() + " between " + lowerBound.toString() + " and " + upperBound.toString() + ".");
                Player.find( { skillRating: { $gte: lowerBound, $lte: upperBound } , userId : { $ne: authorId } , serverId: authorServerId }, 
                    { $sort : { skillRating : 1 } } , (err, players) => {
                    if (err) {
                        console.error(err);
                        return message.reply("I could not read the database!");
                    }
                    
                    if (!players[0]) {
                        return message.reply("I could not find anyone in the database that you can queue with!");
                    } else {
                        let output = ("I found the following players you can queue with:\n");
                        for (let pl of players) {
                            output += pl.battleNet + ": " + pl.skillRating.toString() + " SR\n";
                        }
                        return message.reply(output);
                    }
                });
            }
        });
        
        
    } else {
        
        if(isNaN(args[0])){

            let otherBtag = args[0];
            // btags must be at least 3 characters long
            // thus the earliest a # can appear is at index 3
            if (otherBtag.indexOf("#") <= 2) return message.reply("that's not a battletag!");
            let userSr, otherSr;
        
            console.log("Searching for userid " + authorId.toString() + " and guild " + authorServerId.toString() + ".");
            Player.findOne( {userId: authorId, serverId: authorServerId} , 
                           (err, player) => {
                if (err) {
                    console.error(err);
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
                            console.error(err);
                            return message.reply("I could not read the database!")
                        }
                    
                        if (!otherPlayer) {
                            return message.reply("that player isn't in the database!")
                        } else {
                            otherSr = otherPlayer.skillRating;
                        
                            if (userSr >= 4000 || otherSr >= 4000) {
                                return Math.abs(userSr - otherSr) > GMThreshold ? message.reply(compareFail) : message.reply(compareSuccess);
                            } else if (userSr >= 3500 | otherSr >= 3500) {
                                return Math.abs(userSr - otherSr) > MasterThreshold ? message.reply(compareFail) : message.reply(compareSuccess);
                            } else {
                                return Math.abs(userSr - otherSr) > Threshold ? message.reply(compareFail) : message.reply(compareSuccess);
                            }
                        }
                    });
                }
            
            });

        } else {
            const delimiter = args[0];
            let _GMThreshold = Math.min(delimiter, GMThreshold);
            let _MasterThreshold = Math.min(delimiter, MasterThreshold);
            let _Threshold = Math.min(delimiter, Threshold);

            console.log("Searching for userid " + authorId.toString() + " in guild " + authorServerId.toString() + " with custom delimiter " + Math.min(delimiter, Threshold).toString() + ".");
            Player.findOne( {userId: authorId , serverId: authorServerId} , 
                            (err, player) => {
                if (err) {
                    console.error(err);
                    return message.reply("I could not read the database!");
                }
        
                if (!player) {
                    return message.reply("You're not in the database. Please run \`o!init\` or \`o!help init\` before using this command.");
                } else {
                    userSr = player.skillRating;
               
                    if (userSr < (3500 - _Threshold)) {
                        upperBound = userSr + _Threshold;
                        lowerBound = userSr - _Threshold;
                    } else if (userSr < (3500 - _MasterThreshold)) {
                        upperBound = 3499;
                        lowerBound = userSr - _Threshold;
                    } else if (userSr < 3500) {
                        upperBound = userSr + _MasterThreshold;
                        lowerBound = userSr - _Threshold;
                    } else if (userSr < (4000 - _GMThreshold)) {
                        upperBound = 3999;
                        lowerBound = userSr - _MasterThreshold;
                    } else if (userSr < 4000) {
                        upperBound = userSr + _GMThreshold;
                        lowerBound = userSr - _MasterThreshold;
                    } else {
                        upperBound = userSr + _GMThreshold;
                        lowerBound = userSr - _GMThreshold;
                    }
                
                    console.log("Searching for matches in " + authorServerId.toString() + " between " + lowerBound.toString() + " and " + upperBound.toString() + ".");
                    Player.find( { skillRating: { $gte: lowerBound, $lte: upperBound } , userId : { $ne: authorId } , serverId: authorServerId }, (err, players) => {
                        if (err) {
                            console.error(err);
                            return message.reply("I could not read the database!");
                        }
                    
                        if (!players[0]) {
                            return message.reply("I could not find anyone in the database that you can queue with!");
                        } else {
                            let output = ("I found the following players you can queue with:\n");
                            for (let pl of players) {
                                output += pl.battleNet + ": " + pl.skillRating.toString() + " SR\n";
                            }
                            return message.reply(output);
                        }
                    });
                }
             });
        }
    }
};

exports.help = {
    name: "queue",
    usage: "o!queue, o!queue <battletag>, o!queue <delimiter>",
    description: "Returns a list of all the users in the database that you can queue with. If a battletag is specified, returns whether or not you can queue with that specific person, if they exist in the database. If an integer delimiter is specified, it will use that where applicable instead of the default values. First time users should see o!init first.",
    serverRestriction: "none"
}