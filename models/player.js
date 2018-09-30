const mongoose = require("mongoose");

const playerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    serverId: String,
    battleNet: String,
    skillRating: Number   
});

module.exports = mongoose.model("Player", playerSchema);