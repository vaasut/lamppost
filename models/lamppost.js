var mongoose = require("mongoose");

var lamppostSchema = mongoose.Schema({
  imgUrl: String,
  country: String,
  state: String,
  city: String,
  address: String,
})

module.exports = mongoose.model("Lamppost", lamppostSchema);
