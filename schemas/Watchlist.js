const {Schema} =require("mongoose");

const Watchlist=new Schema({
       name: String,
        price: Number,
        percent: String,
        isDown: Boolean,

});

module.exports={Watchlist};