const Player = require("../models/player.js");
const mongoose = require("mongoose");
const request = require("request");
const cheerio = require("cheerio");

exports.run = async (client, message, args) => {
    mongoose.connect(client.config.db, {
        useNewUrlParser: true
    });
    
    let authorId = message.author.id;
    let profileUrl = "https://playoverwatch.com/en-us/career/pc/"
    let authorSr, btag;
    
    Player.findOne( {userId: authorId} , 
                       (err, player) => {
        if (err) {
            console.log(err);
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
    
                let $ = cheerio.load(body);
                if ($('.u-align-center').text().includes("Not Found")) return;
     
                authorSr = $('div .h5').first().text();
        
            });
            let authorBtag = btag;
    
            setTimeout(() => {
                if(!authorSr) return message.reply("I could not find an SR! Is that account placed?")
        
                console.log("Updating records for user " + message.author.id.toString() + ".");
    
                Player.updateMany( {userId: authorId} , {skillRating: authorSr},
                       (err, player) => {
                    if(err) {
                        console.log(err);
                        return message.reply("I could not update the database!");
                    } else {
                        console.log("Update successful.")
                        return message.reply("your data was updated successfully!");
                    }   
                });     
            }, 1000); 
        }
    });
};

exports.help = {
    name: "update",
    usage: "o!update",
    description: "Updates your SR in the database."
}