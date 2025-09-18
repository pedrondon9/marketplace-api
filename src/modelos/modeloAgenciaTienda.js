const {Schema , model} = require("mongoose")
const data = new Date()
const bcrypt = require("bcrypt")
const mongoosePaginate = require("mongoose-paginate-v2")

//registrar usuario
const ModeloAgenciaTienda =  new Schema({
    nombre:{type:String},
    idAgenceTienda:{type:String},
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

ModeloAgenciaTienda.plugin(mongoosePaginate)
module.exports = model("ModeloAgenciaTienda" , ModeloAgenciaTienda)