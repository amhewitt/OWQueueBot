const Player = require("../models/player.js");
const mongoose = require("mongoose");
const request = require("request");
const cheerio = require("cheerio");

exports.run = async (client, message) => {
    mongoose.connect(client.config.db, {
        useNewUrlParser: true
    });
    
    let authorId = message.author.id;
    let profileUrl = "https://playoverwatch.com/en-us/career/pc/"
    let btag;
    
    console.log("Searching for userid " + authorId.toString() + ".");
    Player.findOne( {userId: authorId} , 
                       (err, player) => {
        if (err) {
            console.error(err);
            return message.reply("I could not read the database!");
        }
        
        if (!player) {
            return message.reply("I can't update you because you're not in the database. Please run \`o!init\` or \`o!help init\`.");
        } else {
            btag = player.battleNet;
            
            profileUrl += btag.replace("#", "-");
            console.log(profileUrl + ": scraping");
    
            request({
                method: 'GET',
                url: profileUrl
            }, (err, res, body) => {
        
                if (err) {
                    message.reply("an error occured! Perhaps OW is down?");
                    return console.error(err);
                }
    
                const srFetch = new Promise((resolve, reject) => {
                    let $ = cheerio.load(body);
                    
                    if ($('.u-align-center').first().text().includes("Not Found")) reject("profile not found");
                    if (isNaN($('div .h5').first().text()) || !($('div .h5').first().text())) reject("element not found");
                    let authorSr = $('div .h5').first().text();
                    resolve(authorSr);
                });
        
                srFetch.then((authorSr) => {
                    let authorId, authorServerId;
        
                    try {
                        authorId = message.author.id;
                        authorServerId = message.guild.id;
                    } catch (err) {
                        console.error("ERROR: " + err);
                        return message.reply("something went wrong! Try that command again.");
                    }
                
                    let authorBtag = btag;
                    console.log("Updating records for user " + message.author.id.toString() + ".");
    
                    Player.updateMany( {userId: authorId} , {skillRating: authorSr},
                           (err) => {
                        if(err) {
                            console.error(err);
                            return message.reply("I could not update the database!");
                        } else {
                            console.log("Update successful.")
                            return message.reply("your data was updated successfully!");
                        }   
                    }); 
                });

                srFetch.catch((err) => {
                    if (err === "element not found") return message.reply("I could not find an SR! Please ensure that your profile is set to public in your ingame settings and that your account has finished its placement matches this season.");
                    if (err === "profile not found") return message.reply("I could not find an account! Please check your spelling.");
                });
            });   
        }
    });
};

exports.help = {
    name: "update",
    usage: "o!update",
    description: "Updates your SR in the database. As of October 13th, 2018, I can no longer update private profiles.",
    serverRestriction: "none"
}