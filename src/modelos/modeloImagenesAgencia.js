const {Schema , model} = require("mongoose")
const data = new Date()
const bcrypt = require("bcrypt")
const mongoosePaginate = require("mongoose-paginate-v2")

//registrar usuario
const ModeloImagenesAgencia =  new Schema({
    user_id:{type:String},
    urlImg:{type:String},
    codeVery:{type:String},
},{
    timestamps:true,
});

ModeloImagenesAgencia.plugin(mongoosePaginate)
module.exports = model("modeloImagenesAgencia" , ModeloImagenesAgencia)