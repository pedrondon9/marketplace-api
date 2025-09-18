const {Schema , model} = require("mongoose")
const data = new Date()
const bcrypt = require("bcrypt")
const mongoosePaginate = require("mongoose-paginate-v2")


const AgregarProduct =  new Schema({
    user:{type:String},
    user_id:{type:String},
    categoria:{type:String},
    subcategoria:{type:String},
    subsubcategoria:{type:String},
    precio :{type:Number},
    descripcion :{type:String},
    nombre :{type:String},
    precioString:{type:String},
    localizacion:{type:String},
    mensage :{type:String},
    llamar :{type:String},
    brevedescripcion:{type:String},
    imagen2:{type:String},
    imagen3:{type:String},
    imagen4:{type:String},
    imagen1:{type:String},
    fecha:{type:Date},
    paiz:{type:String},
    ciudad :{type:String},
},{
    timestamps:true,
});

AgregarProduct.plugin(mongoosePaginate)
module.exports = model("agregarproducts" , AgregarProduct)