// models/PositionModel.js
const { model } = require("mongoose");
const { PositionSchema } = require("../schemas/PositionSchema");

const PositionModel = model("Position", PositionSchema);

module.exports = { PositionModel };
 
