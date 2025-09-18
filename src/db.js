const mongoose = require("mongoose")
const { MONGODB_URI } = require("../config")



mongoose.connect( MONGODB_URI, {
  useUnifiedTopology: true, useNewUrlParser: true 
})
  .then(db => console.log("db is conected"))
  .catch(error => console.log("Error can not conected in db"))