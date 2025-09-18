const {Schema , model} = require("mongoose")
const data = new Date()
const bcrypt = require("bcrypt")
const mongoosePaginate = require("mongoose-paginate-v2")


//registrar usuario
const User =  new Schema({
    nombre:{type:String},
    email:{type:String},
    password:{type:String},
    estado:{type:Boolean},
    token:{type:String},
    contact:{type:String},
    paiz:{type:String},
    genero:{type:String},
    role:{type:String},
    codeVery:{type:String},
    descripcionAgence :{type:String},
    numeroT:{type:String},
    estado:{type:Boolean},
    categoria:{type:String},
    selectForm:{type:String},
    imgLogo:{type:String},
    servicios:{type:String},
    numeroW:{type:String},
},{
    timestamps:true,
});

User.plugin(mongoosePaginate)
module.exports = model("user" , User)