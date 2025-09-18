const express = require("express")
const morgan = require("morgan")
const path = require("path")
const multer = require("multer")
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
const session = require('express-session');
const passport = require('passport');

const app = express()


//db
require("./db")
//passpor-local
require('./passport/local-auth');



//subir archivos con multer
const storage = multer.diskStorage({
    destination:path.join(__dirname , "public/img"),
    filename:(req,file,cb)=>{
        cb(null,uuidv4() + `${path.extname(file.originalname).toLocaleLowerCase()?path.extname(file.originalname).toLocaleLowerCase():".png"}`);
    }
})


//routing
const route = require("./route/rutas")



//setting
app.set("port" , process.env.PORT || 6010)
app.set(morgan("dev"))
app.set("views" , path.join(__dirname , "views"))
app.set("view engine" , "ejs")



//middelware

app.use(express.urlencoded({extended:false}))
app.use(morgan("dev"))
app.use(express.json())
app.use(cors())

app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(multer({
    storage,
    dest:path.join(__dirname , "public/img")

   /* fileFilter:(req,file,cb)=>{
        const filetypes = /jpeg|png|jpg/;
        const mimetype = filetypes.test(file.mimetype) ;
        const extname = filetypes.test(path.extname(file.originalname)) ;
        if (mimetype & extname) {
            return cb(null , true)
            
        }
        cb("error:selecciona una imagen")
    }*/

}).fields([{name:"imagen1"} , {name:"imagen2"} , {name:"imagen3"}, {name:"imagen4"}]))


//route
app.use("/" , route)





//static
app.use(express.static(path.join(__dirname , "public")))





//init server
const puerto = app.get("port")
app.listen( puerto, ()=>{
    console.log(`servidor en el puerto ${puerto}`)
})