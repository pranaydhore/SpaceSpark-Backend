const {model} =require("mongoose");

const {Watchlist}=require("../schemas/Watchlist");

const WatchlistModel=new model("watchlist",Watchlist);

module.exports={WatchlistModel};