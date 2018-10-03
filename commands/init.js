const Player = require("../models/player.js");
const mongoose = require("mongoose");
const request = require("request");
const cheerio = require("cheerio");

exports.run = async (client, message, args) => {
    mongoose.connect(client.config.db, {
        useNewUrlParser: true
    });
    
    let profileUrl = "https://playoverwatch.com/en-us/career/pc/";
    
    if (!args[0]) return message.reply("incorrect number of arguments! Are you sure you sent a battletag?");
    
    let btag = args[0];
    // btags must be at least 3 characters long
    // thus the earliest a # can appear is at index 3
    if (btag.indexOf("#") <= 2) return message.reply("that's not a battletag!");

    profileUrl += btag.replace("#", "-");
    
    console.log(profileUrl + ": scraping");
    let authorSr;
    
    request({
        method: 'GET',
        url: profileUrl
     }, (err, res, body) => {
        
         if (err) {
            message.reply("an error occured! Perhaps OW is down?");
            return console.error(err);
        }

        try {
           
            let $ = cheerio.load(body);
            if ($('.u-align-center').first().text().includes("Not Found")) throw "Profile Not Found";
            if (!isNaN($('div .h5').first().text())) {
                authorSr = $('div .h5').first().text();
                console.log("Found an SR: " + authorSr.toString());
            }

        } catch (err) {
            console.error(err);
            return message.reply("I could not find that account's information! Check your spelling. Remember that battletags are case-sensitive.")
        }
        
    });
    setTimeout(() => {
        
        let authorId, authorServerId;

        try {
            authorId = message.author.id;
            authorServerId = message.guild.id;
        } catch (err) {
            console.error("ERROR: " + err);
            return message.reply("something went wrong! Try that command again.");
        }
        
        let authorBtag = btag;
        
        if (!authorSr) return message.reply("I could not find an SR! Is that account placed?")
    
        // search db for user and guild ids, if there is an item that matches both then return
        console.log("Searching for an existing userid " + authorId.toString() + " in guild " + authorServerId.toString() + ".");
        Player.findOne( {userId: authorId,serverId: authorServerId} , 
                       (err, player) => {
            if(err) {
                console.error(err);
                return message.reply("I could not insert into the database!");
            }
            if (!player) {
                console.log("No matches found. Inserting " + message.author.id.toString() + " from guild id " + message.guild.id.toString() + " into the database.");
                
                const newPlayer = new Player ({
                    _id: mongoose.Types.ObjectId(),
                    userId: authorId,
                    serverId: authorServerId,
                    battleNet: authorBtag,
                    skillRating: authorSr
                });
                
                newPlayer.save().catch(err => {
                    console.error(err);
                    return message.reply("I could not insert into the database!");
                });    
                console.log("Insert successful.");
                return message.reply("you have been inserted successfully!");
                
            } else {
                return message.reply("you are already in the database!");
            }   
        });     
    }, 2000); 
};

exports.help = {
    name: "init",
    usage: "o!init <battletag>",
    description: "Adds a user to the queueing database. Specify by battletag.",
    serverRestriction: "none"
}