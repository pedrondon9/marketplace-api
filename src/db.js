const mongoose = require("mongoose")
const mongodb_atlas1 = "mongodb+srv://mumbe:1234@cluster0.18g1v.mongodb.net/datosDb?retryWrites=true&w=majority"
const mongodb_atlas2 = "mongodb+srv://semu:1234@cluster0.mmgpd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const mongodb_atlas3 = "mongodb+srv://mx:2531996mx@cluster0.l4r9s.mongodb.net/semud?retryWrites=true&w=majority"//actualmente
const mongodb_local = "mongodb://localhost/semussaqqqqaqaaqssssss"
const mongodb_atlas_ocean = "mongodb://134.122.111.251/semuABC"



mongoose.connect(mongodb_atlas_ocean ,{
    
})
  .then(db => console.log("db is conected"))
  .catch(error => console.log("error can not conected in db"))