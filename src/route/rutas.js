const express = require("express")
const path = require("path")
const cloudinary = require("cloudinary")
const fs = require("fs-extra")
const passport = require("passport")
const route = express.Router()
const bcrypt = require("bcrypt")
const { truncate } = require("fs")
const nodemailer = require("nodemailer");
const twilio = require("twilio")
const sharp = require("sharp");
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require('uuid')

//configurar cloudinary

cloudinary.config({
  cloud_name: "mumbex",
  api_key: "161341185562788",
  api_secret: "tzxjgjRrPBozhQJL4ciXiUXct3U"
})

//crear el secret del token
const secretToken = "1234"
const jsonSecret = "kfsfsjfnsd564894sdf6d1sf498496498sf"

//modelos

const User = require("../modelos/userRegistro")
const AgregarProductos = require("../modelos/modeloAgregarPro")
const { Console } = require("console")
const { nextTick } = require("process")
const ModeloAgenciaTienda = require("../modelos/modeloAgenciaTienda")
const modeloImagenesAgencia = require("../modelos/modeloImagenesAgencia")


const emailPassworld = "woycuqzocxrsyudc"
const jwtHast = "abcdefghigdfdtdgbsojlvkshfjkhjfsvfskfhjkf"


















//borrar user desde backend
/*
route.post("/borrar_user", async (req, res) => {
  if (req.body.id) {
    var query = { _id: req.body.id };
    const users = await User.deleteOne(query);
    console.log("borrado")
    res.redirect(`/${req.body.idActual}`)
  } else {
    res.json({ "menss": "borrado" })
  }

})

*/






//la ruta del homme page
/*
route.get("/i" , (req , res) => {
    res.render("index")
})
*/
/********** */
/******************************************************** */

//POST DE REGISTRO DE USUARIOS


route.post('/registro_post', async (req, res) => {
  console.log(req.body)

  const selectFor = req.body.selectForm

  switch (selectFor) {
    case "0101"://PRRA REGISTRO PERSONAL
      try {
        console.log(req.body)
        const email = req.body.email
        const usuario = req.body.nombre

        if (req.body.role) {
          var role = req.body.role
        } else {
          var role = "user"
        }

        if (req.body.contact) {
          var contact = req.body.contact
        } else {
          var contact = ""
        }
        const password = req.body.contrasena
        const validar = email && usuario && password && selectFor

        const user = await User.findOne({ 'email': email })//verificar si el email existe antes del nuevo registro para que no se dublique
        console.log(user)
        if (!user) {

          if (validar) {

            const newUser = new User();//el modelo de registro de usuarios

            /************************* */
            //encriptando la contraseña
            /****************************************** */
            const passwortEcryp = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

            /******************************* */
            //Asignando valores a cada variable del modelo de registro de usuarios para su posterior almacenamiento en la base de datos
            /******************************************************************* */
            newUser.nombre = req.body.nombre
            newUser.email = email
            newUser.contact = contact
            newUser.password = passwortEcryp
            newUser.role = role
            newUser.estado = false
            newUser.token = newUser["_id"]

            /*************************************** */
            //***********************/
            //crear el token
            /************************ */
            const token = jwt.sign({
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 6/* 24 * 30*/,
              user: usuario,
              id: newUser["_id"],
            }, jsonSecret)

            console.log(token)

            /***********************************/
            //Para enviar el link de verificacion de email 
            /******************************************* */

            const correo = email
            const linkImg = 'https://res.cloudinary.com/mumbe/image/upload/c_thumb,w_200,g_face/v1639482203/kisspng-shopping-cart-computer-icons-online-shopping-buy-5abedd9c448d14.1345528515224580122808_fnfo0p.png'
            const linkConfir = token
            const html = "<head><meta charset='UTF-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>Document</title></head>"
            const html1 = "<body>" + `<p style='text-align: center;'>Hola ${usuario} , bienvenido al mercado digital de semu para poder activar tu cuenta haz click en el siguiente boton</p>`
            const html2 = `<div  style='display: flex;width: 100%;height: 100px;justify-content: center;align-items: center;'><a href = '${"https://mercadosemu.com/#/confirm/" + linkConfir}'style='font-size: 20px;' >Has click para verificar tu cuenta !</a></div>`
            const html3 = `<div style='width: 100%;display: flex;justify-content: center;'><img src=${linkImg} alt=''></div>`
            const html4 = "<h3 style='font-size: 17px;font-weight: 400;text-align: center;color: #212121 ;'></h3>" + "<a style='text-align: center;' href='https://mumbx.com'>desarrollado por mumbeX software developer</a>" + "</body>"

            let transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 465,
              secure: true, // 
              auth: {
                user: "pedronnd689@gmail.com", // 
                pass: emailPassworld, // 
              },
            });

            try {
              const resEmail = await transporter.sendMail({
                from: '"Mercado digital semu" <pedronnd689@gmail.com>', //el email que va emitar
                to: correo, // lista de email que van a resibir
                subject: "Activacion de cuenta", //
                text: "hola", // 
                html: html + html1 + html2 + html3 + html4, // html body
              });
              console.log(resEmail)
            } catch {
              res.json("el correo no existe")
            }


            /******* fin para enviar  link */
            /******************************************* */

            /*******************/
            //guardar datos 
            /************************ */
            const datosUser = await newUser.save();
            console.log(datosUser)
            /************************** */

            res.json("activa tu cuenta mediante el link enviado en tu correo")
          } else {
            res.json("Comprueba que has rellenado todos los campos")
          }

        } else {
          res.send("el usuario ya existe")
        }
      } catch (error) {
        res.json("hay un problema")
      }
      break;
    case "0202"://PARA REGISTRARSE COMO AGENCIA O TIENDA
      try {

        const { email, password, usuario, descripcionAgence, numeroW, numeroT, selectForm } = req.body
        if (req.body.role) {
          var role = req.body.role
        } else {
          var role = "user"
        }


        const validar = email && password && usuario && descripcionAgence && numeroW && numeroT && selectForm

        const user = await User.findOne({ 'email': email })//verificar si el email existe antes del nuevo registro para que no se dublique
        console.log(user)
        if (!user) {

          if (validar) {


            const newUser = new User();//el modelo de registro de usuarios
            const newAgenceTienda = new ModeloAgenciaTienda();//el modelo agencia o tienda

            /************************* */
            //encriptando la contraseña
            /****************************************** */
            const passwortEcryp = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

            /******************************* */
            //Asignando valores a cada variable del modelo de registro de usuarios para su posterior almacenamiento en la base de datos
            /******************************************************************* */
            newUser.nombre = usuario
            newUser.contact = ""
            newUser.email = email
            newUser.paiz = ""
            newUser.genero = ""
            newUser.role = role
            newUser.estado = false
            newUser.token = newUser["_id"]
            newUser.password = passwortEcryp
            newUser.codeVery = uuidv4()
            newUser.descripcionAgence = descripcionAgence
            newUser.imgLogo = "https://mumbexserver.tech/img/" + req.files["imagen1"][0].filename
            newUser.numeroT = numeroT
            newUser.estado = false
            newUser.selectForm = selectForm
            newUser.numeroW = numeroW


            /*************************************** */
            //***********************/
            //crear el token
            /************************ */
            const token = jwt.sign({
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 6/* 24 * 30*/,
              user: usuario,
              id: newUser["_id"],
            }, jsonSecret)

            console.log(token)

            /***********************************/
            //Para enviar el link de verificacion de email 
            /******************************************* */

            const correo = email
            const linkImg = 'https://res.cloudinary.com/mumbe/image/upload/c_thumb,w_200,g_face/v1639482203/kisspng-shopping-cart-computer-icons-online-shopping-buy-5abedd9c448d14.1345528515224580122808_fnfo0p.png'
            const linkConfir = token
            const html = "<head><meta charset='UTF-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>Document</title></head>"
            const html1 = "<body>" + `<p style='text-align: center;'>Hola ${usuario} , bienvenido al mercado digital de semu para poder activar tu cuenta haz click en el siguiente boton</p>`
            const html2 = `<div  style='display: flex;width: 100%;height: 100px;justify-content: center;align-items: center;'><a href = '${"https://mercadosemu.com/#/confirm/" + linkConfir}'style='font-size: 20px;' >Has click para verificar tu cuenta !</a></div>`
            const html3 = `<div style='width: 100%;display: flex;justify-content: center;'><img src=${linkImg} alt=''></div>`
            const html4 = "<h3 style='font-size: 17px;font-weight: 400;text-align: center;color: #212121 ;'></h3>" + "<a style='text-align: center;' href='https://mumbx.com'>desarrollado por mumbeX software developer</a>" + "</body>"

            let transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 465,
              secure: true, // 
              auth: {
                user: "pedronnd689@gmail.com", // 
                pass: emailPassworld, // 
              },
            });

            try {
              const resEmail = await transporter.sendMail({
                from: '"Mercado digital semu" <pedronnd689@gmail.com>', //el email que va emitar
                to: correo, // lista de email que van a resibir
                subject: "Activacion de cuenta", //
                text: "hola", // 
                html: html + html1 + html2 + html3 + html4, // html body
              });
              console.log(resEmail)
            } catch {
              res.json("el correo no existe")
            }

            /******* fin para enviar  link */
            /******************************************* */

            /*******************/
            //guardar datos 
            /************************ */
            const datosUser = await newUser.save();
            console.log(datosUser)
            /************************** */

            res.json("activa tu cuenta mediante el link enviado en tu correo")

          } else {
            res.json("Comprueba que has rellenado todos los campos sss")
          }

        } else {
          res.send("el usuario ya existe")
        }
      } catch (error) {
        res.json("hay un problema")
      }
      break;

    default:
      break;
  }

})

/********** */
/******************************************************** */


//POST DE LOGEO DE USUARIOS

route.post('/login_post', async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.contrasena
    console.log(email, "bbbbbb", password)

    //verificar si el email existe en la base de datos
    const user = await User.findOne({ email: email });
    console.log(user)

    if (user) {
      if (user["estado"] != false/*verificando si ya se activoo la cuenta */) {

        //comparar la contraseña del inicio de sesion con la que esta guardada en la base de datos si son iguales
        const comparePass = bcrypt.compareSync(password, user["password"])
        if (comparePass) {

          //creacion del token
          const newToken = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 6 /*60  24 * 30*/,
            user: user['nombre'],
            id: user['_id']
          }, jsonSecret)
          //enviar respuesta al cliente con sus datos
          const respuesta = { 'user': user['nombre'], 'id': user['_id'], "code": newToken, "mens": "" }
          res.json(respuesta)
        } else {
          res.json({ "mens": "usuario o contraseña  no valido" })
        }
      } else {
        res.json({ "mens": "Tu cuenta no esta activada , por favor activa tu cuenta atravez del link que hemos enviado en tu correo" })
      }
    } else {
      res.json({ "mens": "usuario o contraseña  no valido" })
    }
  } catch (error) {
    res.json({ "mens": "hay un problema" })
  }


})

/********** */
/******************************************************** */


//RUTA PARA CONFIRMAR Y VALIDAR EMAIL

route.post("/confirmar", async (req, res) => {
  try {
    const { tokenId } = req.body
    console.log(tokenId)

    const userData = await jwt.verify(tokenId, jsonSecret)
    const token = await User.findOne({ token: userData.id });
    console.log(token)
    if (token) {
      var estado = { "$set": { 'estado': true } };
      const datos = await User.findByIdAndUpdate({ "_id": token._id }, estado)
      if (datos) {
        console.log(datos, "datos", datos._id, "gggggggggggggggggggggggggggggg")

        //crear el token
        const newToken = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 6/* 60 *10*/,
          user: datos['nombre'],
          id: datos['_id']
        }, jsonSecret)

        res.json({
          code: newToken,
          user: datos['nombre'],
          id: datos['_id'],
        })
      } else {
        res.json(false)
      }

    } else {
      res.json(false)
    }
  } catch {
    res.json(false)
  }
})
/********** */
/******************************************************** */
//confirmar inicio "en prueba"
/*
si el usuario intenta acceder a su cuenta primero verificaran
si los datos almacenados en su cachee son validos
*/
route.post("/user_confirm_init", async (req, res) => {
  try {
    const { id } = req.body
    const userData = await jwt.verify(id, jsonSecret)
    const user = await User.findById(userData.id);
    if (user) {
      res.json({
        user: user.nombre,
        id: user._id,
        code: id
      })
    } else {
      res.json(false)
    }
  } catch (error) {
    res.json(false)
  }

})



//PRUEBA DE JSON WEB TOKEN

route.get("/cat", async (req, res) => {
  //const token = await jwt.sign({datos:"que se envia"},jwtHast,{
  //expiresIn:60
  //})
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRvcyI6InF1ZSBzZSBlbnZpYSIsImlhdCI6MTY1MDk4MjU0MCwiZXhwIjoxNjUwOTgyNjAwfQ.NtoS2uYK_VbxDKe91VyU976dIp1q7QcLeOWLHvw-etM"
  //const deToken = jwt.verify(token,jwtHast)

  //console.log(deToken)

  res.render("confirm.ejs")
})
/******************************************************** */


//ruta para agregar o publicar producto 02 sin subir la foto

route.post("/agregarProductoSoloLinkFoto", async (req, res) => {

  const user = req.body.user
  const user_id = req.body.user_id
  const categoria = req.body.categoria
  const subcategoria = req.body.subcategoria
  const subSubCategoria = req.body.subsubcategoria
  const descripcion = req.body.descripcion.toLowerCase()
  const breveDescripcion = req.body.breveDescripcion.toLowerCase()
  const precio = req.body.precio
  const mensaje = req.body.numeroW
  const llamar = req.body.numeroT
  const paiz = req.body.paiz
  const ciudad = req.body.ciudad

  const validar = categoria && subcategoria && breveDescripcion && paiz && ciudad && mensaje && req.body.imagen1

  if (validar) {
    const producto = new AgregarProductos()

    producto.user = user
    producto.user_id = user_id
    producto.categoria = categoria
    producto.subcategoria = subcategoria
    if (req.body.subsubcategoria) {
      producto.subsubcategoria = req.body.subsubcategoria
    } else {
      producto.subsubcategoria = ""
    }

    producto.descripcion = descripcion
    producto.mensage = mensaje
    producto.llamar = llamar
    producto.paiz = paiz
    producto.ciudad = ciudad
    producto.brevedescripcion = breveDescripcion
    producto.precio = precio

    if (req.body.imagen1) {
      producto.imagen1 = req.body.imagen1
    } else {

    }
    if (req.body.imagen2) {
      producto.imagen2 = req.body.imagen2
    } else {

    }
    if (req.body.imagen3) {
      producto.imagen3 = req.body.imagen3
    } else {

    }
    if (req.body.imagen4) {
      producto.imagen4 = req.body.imagen4
    } else {

    }
    const p = await producto.save()

    console.log(p)

    res.json("producto publicado")
  } else {
    res.json("Asegurate de haber rellenedo los campos obligatorios")
  }

})
/******************************************************** */




//ruta para agregar o publicar producto 01 con la foto


route.post("/agregarProducto", async (req, res) => {

  try {
    const producto = new AgregarProductos()
    const user = req.body.user
    const user_id = req.body.user_id
    const categoria = req.body.categoria
    const subcategoria = req.body.subcategoria
    const descripcion = req.body.descripcion.toLowerCase()
    const precio = req.body.precio
    const precioString = req.body.precioString
    const nombre = req.body.nombreOMarca.toLowerCase()
    const mensaje = req.body.numeroW
    const llamar = req.body.numeroT
    const paiz = req.body.paiz
    const ciudad = req.body.ciudad
    const localizacion = req.body.localizacion
    const imagen01 = req.files["imagen1"]
    const breveDescripcion = req.body.breveDescripcion.toLowerCase()


    const validar = categoria && subcategoria && breveDescripcion && paiz && ciudad && mensaje && imagen01 && paiz && ciudad && nombre

    if (validar) {
      class AnalizarImage {
        constructor() {
          if (req.files["imagen1"]) {
            if ((req.files["imagen1"][0].mimetype == "image/png") || (req.files["imagen1"][0].mimetype == "image/jpg") || (req.files["imagen1"][0].mimetype == "image/jpeg")) {
              this.imagen1 = req.files["imagen1"]
            } else {
              this.imagen1 = "noIgm"
            }
          } else {
            this.imagen1 = ""
          }
          if (req.files["imagen2"]) {
            if ((req.files["imagen2"][0].mimetype == "image/png") || (req.files["imagen2"][0].mimetype == "image/jpg") || (req.files["imagen2"][0].mimetype == "image/jpeg")) {
              this.imagen2 = req.files["imagen2"]

            } else {
              this.imagen2 = "noIgm"

            }
          } else {
            this.imagen2 = ""
          }
          if (req.files["imagen3"]) {
            if ((req.files["imagen3"][0].mimetype == "image/png") || (req.files["imagen3"][0].mimetype == "image/jpg") || (req.files["imagen3"][0].mimetype == "image/jpeg")) {
              this.imagen3 = req.files["imagen3"]

            } else {
              this.imagen3 = "noIgm"

            }
          } else {
            this.imagen3 = ""
          }
          if (req.files["imagen4"]) {
            if ((req.files["imagen4"][0].mimetype == "image/png") || (req.files["imagen4"][0].mimetype == "image/jpg") || (req.files["imagen4"][0].mimetype == "image/jpeg")) {
              this.imagen4 = req.files["imagen4"]
            } else {
              this.imagen4 = "noIgm"
            }
          } else {
            this.imagen4 = ""
          }
          if (req.body.subsubcategoria) {
            this.subsubcategoria = req.body.subsubcategoria
          } else {
            this.subsubcategoria = ""
          }
        }
      }
      const analizarImage = new AnalizarImage()
      const imagen1 = analizarImage.imagen1
      const imagen2 = analizarImage.imagen2
      const imagen3 = analizarImage.imagen3
      const imagen4 = analizarImage.imagen4
      const subsubcategoria = analizarImage.subsubcategoria


      if (imagen1 != "noIgm" && imagen2 != "noIgm" && imagen3 != "noIgm" && imagen4 != "noIgm") {

        const data = new Date()
        var url1 = ""

        const urls = async () => {
          for (let i = 1; i < 5; i++) {
            var cifrarImg = uuidv4()

            if (eval(`${"imagen" + `${i}`}`) != "") {
              console.log(i, "wwwwwwwwwwqqqqqqaaaaaaaaa")
              console.log()

              await sharp(eval(`${"imagen" + `${i}`}`)[0].path)
                .resize(500, null, { fit: "contain" })
                .toFormat("jpg")
                //.jpeg({ quality: 100 })
                .toFile(path.join(__dirname, "../public/img/" + `${i + "-" + cifrarImg}` + ".jpg"))
                .then(async (img) => {
                  console.log(img, "imagen reducido")
                  //const cloud = await cloudinary.v2.uploader.upload(path.join(__dirname, "../public/img/" + `${i}` + ".jpg"))
                  //console.log(cloud)
                  //await fs.unlink(path.join(__dirname, "../public/img/" + `${i}` + ".jpg"))
                  await fs.unlink(eval(`${"imagen" + `${i}`}`)[0].path)
                  producto["imagen" + `${i}`] = "https://mumbexserver.tech/img/"/*"http://localhost:5000/img/"*/ + `${i + "-" + cifrarImg}` + ".jpg" //cloud.secure_url
                })
                .catch((err) => res.json("hay un problema"));

            }
          }
          producto.user = user
          producto.user_id = user_id
          producto.categoria = categoria
          producto.subcategoria = subcategoria
          producto.subsubcategoria = subsubcategoria
          producto.descripcion = descripcion
          producto.mensage = mensaje
          producto.llamar = llamar
          producto.paiz = paiz
          producto.ciudad = ciudad
          producto.nombre = nombre
          producto.localizacion = localizacion
          producto.brevedescripcion = breveDescripcion
          producto.precio = precio
          producto.precioString = precioString
          producto.fecha = data
          const p = await producto.save()
          console.log(p)
          res.json("producto publicado")
        }

        await urls()
        /*
              producto.user = user
              producto.user_id = user_id
              producto.categoria = categoria
              producto.subcategoria = subcategoria
              producto.subsubcategoria = subsubcategoria
              producto.descripcion = descripcion
              producto.mensage = mensaje
              producto.llamar = llamar
              producto.paiz = paiz
              producto.ciudad = ciudad
              producto.localizacion = localizacion
              producto.brevedescripcion = breveDescripcion
              producto.precio = precio
              const p = await producto.save()
              console.log(p)
              res.json("producto publicado")*/
      } else {
        res.json("solo imegen jpg , jpeg y png, verifica tus imagenes")
      }
    } else {
      res.json("asegurate de tener todos los campus obligatorios rellenos")
    }
  } catch (error) {
    res.json("hay un problema")
  }
})


/*RUTA PARA OBTENER ARTICULOS PARA EL HOME DEL FRONT END*/

route.post("/home_article", async (req, res) => {
  try {
    console.log(req.body)
    //const v = !req.body?"mmqwcqqqqqqqqqqqqqqqqqqqm":"jjj wwwwwwwwwwwwwwwj"

    if (req.body.pais && req.body.ciudad === "") {
      const productos = await AgregarProductos.paginate({ paiz: req.body.pais }, { limit: 10, sort: { fecha: -1 } })
      console.log(productos)
      res.json(productos)
    } else {
      if (req.body.pais && req.body.ciudad) {

        const productos = await AgregarProductos.paginate({ paiz: req.body.pais, ciudad: req.body.ciudad }, { limit: 20, sort: { fecha: -1 } })
        console.log(productos)
        res.json(productos)
      } else {
        const productos = await AgregarProductos.paginate({}, { limit: 10, sort: { fecha: -1 } })
        console.log(productos)
        res.json(productos)
      }
    }
  } catch (error) {
    res.json([])
  }
})

/********** */

/******************************************************** */
/*RUTA PARA OBTENER ARTICULOS PARA EL VER INFO DEL PRODUCTO DEL FRONT END*/

route.post("/home_article_simple/:id", async (req, res) => {

  try {
    const { id } = req.params
    const producto = await AgregarProductos.find({ _id: id })


    if (producto) {
      const subCatRelac = producto[0]["categoria"]
      //Articulos relacionados
      const prodRelac = await AgregarProductos.paginate({ categoria: subCatRelac }, { limit: 10, sort: { fecha: -1 } })
      const datos = { articulo: producto, articRelac: prodRelac.docs }
      console.log(datos)
      res.json(datos)
    } else {
      res.json({ articulo: [], articRelac: [] })
    }
  } catch (error) {
    res.json({ articulo: [], articRelac: [] })
  }

})

/********** */
/******************************************************** */
/******************************************************** */
/*RUTA PARA OBTENER ARTICULOS PARA EL HOME DEL FRONT END*/
/*
route.get("/home_article_servicios" ,async (req , res) => {
  const producto = await AgregarProductos.find({categoria:"4"})
  console.log(producto)
  res.json(producto)
})
*/
/********** */
/******************************************************** */
/*RUTA PARA OBTENER ARTICULOS PARA LA PAGINA DE CATEGORIA DEL FRONT END*/

route.post("/ver_articulo/:id", async (req, res) => {

  try {
    const { id } = req.params
    console.log(req.body.precio1, req.body.precio2, req.body.pais, req.body.ciudad)
    var producto = ""


    if (req.body.pais && req.body.ciudad === "") {
      const categorias = ["1", "2", "3", "4", "5", "6"]
      if (id == 1 || id == 2 || id == 3 || id == 4 || id == 5 || id == 6 || id == 8) {
        console.log("categoria")
        if (/*req.body.precio1 && */req.body.precio2) {
          console.log("con precio")
          producto = await AgregarProductos.paginate({
            categoria: id,
            paiz: req.body.pais,
            $and: [/*{ precio: { $gte: req.body.precio1 } }, */{ precio: { $lte: req.body.precio2 } }]
          },
            {
              limit: 15, sort: { fecha: -1 }
            })
          console.log(producto)
          res.json(producto)
        } else {
          producto = await AgregarProductos.paginate({ categoria: id, paiz: req.body.pais }, { limit: 15, sort: { fecha: -1 } })
          console.log(producto)
          res.json(producto)
        }

      } else if (id[2]) {
        console.log(id)
        if (/*req.body.precio1 && */req.body.precio2) {
          console.log("subsubcategoria")
          producto = await AgregarProductos.paginate({
            subsubcategoria: id,
            paiz: req.body.pais,
            $and: [/*{ precio: { $gte: req.body.precio1 } }, */{ precio: { $lte: req.body.precio2 } }]
          }, { limit: 15, sort: { fecha: -1 } })
          console.log(producto)
          res.json(producto)
        } else {
          producto = await AgregarProductos.paginate({ subsubcategoria: id, paiz: req.body.pais }, { limit: 15, sort: { fecha: -1 } })
          console.log(producto)
          res.json(producto)
        }

      } else {
        console.log("subcategoria")
        if (/*req.body.precio1 && */req.body.precio2) {
          producto = await AgregarProductos.paginate({
            subcategoria: id,
            paiz: req.body.pais,
            $and: [/*{ precio: { $gte: req.body.precio1 } }, */{ precio: { $lte: req.body.precio2 } }]
          },
            { limit: 15, sort: { fecha: -1 } })
          console.log(producto)
          res.json(producto)

        } else {
          console.log("wwwwwwwwwwww")
          producto = await AgregarProductos.paginate({ subcategoria: id, paiz: req.body.pais }, { limit: 15, sort: { fecha: -1 } })
          console.log(producto)
          res.json(producto)
        }

      }

    } else {
      if (req.body.pais && req.body.ciudad) {
        const categorias = ["1", "2", "3", "4", "5", "6"]
        if (id == 1 || id == 2 || id == 3 || id == 4 || id == 5 || id == 6 || id == 8) {
          console.log("categoria")
          if (/*req.body.precio1 && */req.body.precio2) {
            producto = await AgregarProductos.paginate({
              categoria: id, paiz: req.body.pais, ciudad: req.body.ciudad,
              $and: [/*{ precio: { $gte: req.body.precio1 } }, */{ precio: { $lte: req.body.precio2 } }]
            }, { limit: 15, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)
          } else {
            producto = await AgregarProductos.paginate({
              categoria: id, paiz: req.body.pais, ciudad: req.body.ciudad,
            }, { limit: 15, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)

          }
        } else if (id[2]) {
          console.log("subsubcategoria")
          if (/*req.body.precio1 && */req.body.precio2) {
            producto = await AgregarProductos.paginate({
              subsubcategoria: id,
              paiz: req.body.pais,
              ciudad: req.body.ciudad,
              $and: [/*{ precio: { $gte: req.body.precio1 } }, */{ precio: { $lte: req.body.precio2 } }]
            }, { limit: 15, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)
          } else {
            producto = await AgregarProductos.paginate({
              subsubcategoria: id, paiz: req.body.pais,
              ciudad: req.body.ciudad,
            }, { limit: 15, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)
          }

        } else {
          console.log("subcategoria")
          if (/*req.body.precio1 && */req.body.precio2) {
            producto = await AgregarProductos.paginate({
              subcategoria: id,
              paiz: req.body.pais,
              ciudad: req.body.ciudad,
              $and: [/*{ precio: { $gte: req.body.precio1 } }, */{ precio: { $lte: req.body.precio2 } }]
            },
              { limit: 15, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)

          } else {
            console.log("wwwwwwwwwwww")
            producto = await AgregarProductos.paginate({
              subcategoria: id, paiz: req.body.pais,
              ciudad: req.body.ciudad,
            }, { limit: 15, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)
          }


        }
      } else {
        if (id == 1 || id == 2 || id == 3 || id == 4 || id == 5 || id == 6 || id == 8) {
          console.log("categoria")
          if (/*req.body.precio1 && */req.body.precio2) {
            console.log("con precio")
            producto = await AgregarProductos.paginate({
              categoria: id,
              $and: [/*{ precio: { $gte: req.body.precio1 } }, */{ precio: { $lte: req.body.precio2 } }]
            }, { limit: 15, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)

          } else {
            producto = await AgregarProductos.paginate({ categoria: id }, { limit: 15, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)
          }

        } else if (id[2]) {
          console.log("subsubcategoria")
          if (/*req.body.precio1 && */req.body.precio2) {
            producto = await AgregarProductos.paginate({
              subsubcategoria: id,
              $and: [/*{ precio: { $gte: req.body.precio1 } }, */{ precio: { $lte: req.body.precio2 } }]
            }, { limit: 15, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)

          } else {
            producto = await AgregarProductos.paginate({ subsubcategoria: id }, { limit: 15, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)

          }

        } else {
          console.log("subcategoria")
          if (/*req.body.precio1 && */req.body.precio2) {
            producto = await AgregarProductos.paginate({
              subcategoria: id,
              $and: [/*{ precio: { $gte: req.body.precio1 } }, */{ precio: { $lte: req.body.precio2 } }]
            }, { limit: 15, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)
          } else {
            producto = await AgregarProductos.paginate({ subcategoria: id }, { limit: 15, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)
          }

        }
      }
    }
  } catch (error) {
    res.json([])
  }

})

/********** */
/******************************************************** */


/*RUTA PARA OBTENER ARTICULOS PARA EL VERCATEGORIA CON PAGINACION DEL FRONT END*/

route.post("/ver_articulo_paginacion/:id", async (req, res) => {
  try {
    const { id } = req.params

    if (req.body.pais && req.body.ciudad === "") {
      if (id.slice(0, 1) == "a") {
        console.log(id.slice(1, 2), "categoria")
        catego = id.slice(1, 2)
        pagin = Number(id.slice(2,))
        console.log(id, "categoria")
        if (req.body.precio1 && req.body.precio2) {
          const producto = await AgregarProductos.paginate({
            categoria: catego,
            paiz: req.body.pais,
            $and: [{ precio: { $gte: req.body.precio1 } }, { precio: { $lte: req.body.precio2 } }]
          }, { limit: 8, page: pagin, sort: { fecha: -1 } })
          console.log(producto)
          res.json(producto)
        } else {
          const producto = await AgregarProductos.paginate({ categoria: catego, paiz: req.body.pais }, { limit: 8, page: pagin, sort: { fecha: -1 } })
          console.log(producto)
          res.json(producto)
        }

      } else if (id.slice(0, 1) == "b") {
        console.log(id.slice(1, 3), "subcategoriabbbb")
        catego = id.slice(1, 3)
        pagin = Number(id.slice(3,))
        console.log(id, "subcategoria")
        if (req.body.precio1 && req.body.precio2) {
          console.log("ssssssssssssssssssssssssss")
          const producto = await AgregarProductos.paginate({
            subcategoria: catego,
            paiz: req.body.pais,
            $and: [{ precio: { $gte: req.body.precio1 } }, { precio: { $lte: req.body.precio2 } }]
          }, { limit: 8, page: pagin, sort: { fecha: -1 } })
          console.log(producto)
          res.json(producto)
        } else {
          //console.log("ssssssssssssssssssssssssss")
          const producto = await AgregarProductos.paginate({ subcategoria: catego, paiz: req.body.pais }, { limit: 8, page: pagin, sort: { fecha: -1 } })
          console.log(producto)
          res.json(producto)
        }


      } else if (id.slice(0, 1) == "c") {
        console.log(id.slice(1, 4), "subsubcategoria")
        catego = id.slice(1, 4)
        pagin = Number(id.slice(4,))
        console.log(id, "subsubcategoria")
        if (req.body.precio1 && req.body.precio2) {
          const producto = await AgregarProductos.paginate({
            subsubcategoria: catego,
            paiz: req.body.pais,
            $and: [{ precio: { $gte: req.body.precio1 } }, { precio: { $lte: req.body.precio2 } }]
          }, { limit: 8, page: pagin, sort: { fecha: -1 } })
          console.log(producto)
          res.json(producto)
        } else {
          const producto = await AgregarProductos.paginate({ subsubcategoria: catego, paiz: req.body.pais }, { limit: 8, page: pagin, sort: { fecha: -1 } })
          console.log(producto)
          res.json(producto)
        }

      } else if (id.slice(0, 1) == "d") {
        if (Number(id.slice(1, 3))) {
          console.log(id.slice(1, 4), "palabra")
          catego = id.slice(3,)
          pagin = Number(id.slice(1, 3))
          console.log(id, "categoria")
          if (req.body.precio1 && req.body.precio2) {
            const resultado = await AgregarProductos.paginate({
              brevedescripcion: { "$regex": catego },
              paiz: req.body.pais,
              $and: [{ precio: { $gte: req.body.precio1 } }, { precio: { $lte: req.body.precio2 } }]
            },
              { limit: 8, page: pagin, sort: { fecha: -1 } }) //await AgregarProductos.find({brevedescripcion:{"$regex":id}})
            console.log(resultado)
            res.json(resultado)
          } else {
            const resultado = await AgregarProductos.paginate({ brevedescripcion: { "$regex": catego }, paiz: req.body.pais }, { limit: 8, page: pagin, sort: { fecha: -1 } }) //await AgregarProductos.find({brevedescripcion:{"$regex":id}})
            console.log(resultado)
            res.json(resultado)
          }

        } else {
          console.log(id.slice(1, 4), "palabra")
          catego = id.slice(2,)
          pagin = Number(id.slice(1, 2))
          console.log(id, "categoria")
          if (req.body.precio1 && req.body.precio2) {
            const resultado = await AgregarProductos.paginate({
              brevedescripcion: { "$regex": catego },
              paiz: req.body.pais,
              $and: [{ precio: { $gte: req.body.precio1 } }, { precio: { $lte: req.body.precio2 } }]
            }, { limit: 8, page: pagin, sort: { fecha: -1 } }) //await AgregarProductos.find({brevedescripcion:{"$regex":id}})
            console.log(resultado)
            res.json(resultado)
          } else {
            const resultado = await AgregarProductos.paginate({ brevedescripcion: { "$regex": catego }, paiz: req.body.pais }, { limit: 8, page: pagin, sort: { fecha: -1 } }) //await AgregarProductos.find({brevedescripcion:{"$regex":id}})
            console.log(resultado)
            res.json(resultado)
          }

        }

      }
    } else {
      if (req.body.pais && req.body.ciudad) {
        if (id.slice(0, 1) == "a") {
          console.log(id.slice(1, 2), "categoria")
          catego = id.slice(1, 2)
          pagin = Number(id.slice(2,))
          console.log(id, "categoria")
          if (req.body.precio1 && req.body.precio2) {
            console.log("pais ciudad ggggggggggggg")
            const producto = await AgregarProductos.paginate({
              categoria: catego,
              paiz: req.body.pais,
              ciudad: req.body.ciudad,
              $and: [{ precio: { $gte: req.body.precio1 } }, { precio: { $lte: req.body.precio2 } }]
            }, { limit: 8, page: pagin, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)
          } else {
            const producto = await AgregarProductos.paginate({ categoria: catego, paiz: req.body.pais, ciudad: req.body.ciudad }, { limit: 8, page: pagin, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)
          }

        } else if (id.slice(0, 1) == "b") {
          console.log(id.slice(1, 3), "subcategoria")
          catego = id.slice(1, 3)
          pagin = Number(id.slice(3,))
          console.log(id, "subcategoria")
          if (req.body.precio1 && req.body.precio2) {
            const producto = await AgregarProductos.paginate({
              subcategoria: catego,
              paiz: req.body.pais,
              ciudad: req.body.ciudad,
              $and: [{ precio: { $gte: req.body.precio1 } }, { precio: { $lte: req.body.precio2 } }]
            }, { limit: 8, page: pagin, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)
          } else {
            const producto = await AgregarProductos.paginate({ subcategoria: catego, paiz: req.body.pais, ciudad: req.body.ciudad }, { limit: 8, page: pagin, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)
          }


        } else if (id.slice(0, 1) == "c") {
          console.log(id.slice(1, 4), "subsubcategoria")
          catego = id.slice(1, 4)
          pagin = Number(id.slice(4,))
          console.log(id, "subsubcategoria")
          if (req.body.precio1 && req.body.precio2) {
            const producto = await AgregarProductos.paginate({
              subsubcategoria: catego,
              paiz: req.body.pais,
              ciudad: req.body.ciudad,
              $and: [{ precio: { $gte: req.body.precio1 } }, { precio: { $lte: req.body.precio2 } }]
            }, { limit: 8, page: pagin, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)
          } else {
            const producto = await AgregarProductos.paginate({ subsubcategoria: catego, paiz: req.body.pais, ciudad: req.body.ciudad }, { limit: 8, page: pagin, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)
          }

        } else if (id.slice(0, 1) == "d") {
          if (Number(id.slice(1, 3))) {
            console.log(id.slice(1, 4), "palabra")
            catego = id.slice(3,)
            pagin = Number(id.slice(1, 3))
            console.log(id, "categoria")
            if (req.body.precio1 && req.body.precio2) {
              const resultado = await AgregarProductos.paginate({
                brevedescripcion: { "$regex": catego },
                paiz: req.body.pais,
                ciudad: req.body.ciudad,
                $and: [{ precio: { $gte: req.body.precio1 } }, { precio: { $lte: req.body.precio2 } }]
              },
                { limit: 8, page: pagin, sort: { fecha: -1 } }) //await AgregarProductos.find({brevedescripcion:{"$regex":id}})
              console.log(resultado)
              res.json(resultado)
            } else {
              const resultado = await AgregarProductos.paginate({ brevedescripcion: { "$regex": catego }, paiz: req.body.pais, ciudad: req.body.ciudad, }, { limit: 8, page: pagin, sort: { fecha: -1 } }) //await AgregarProductos.find({brevedescripcion:{"$regex":id}})
              console.log(resultado)
              res.json(resultado)
            }

          } else {
            console.log(id.slice(1, 4), "palabra")
            catego = id.slice(2,)
            pagin = Number(id.slice(1, 2))
            console.log(id, "categoria")
            if (req.body.precio1 && req.body.precio2) {
              const resultado = await AgregarProductos.paginate({
                brevedescripcion: { "$regex": catego },
                paiz: req.body.pais,
                ciudad: req.body.ciudad,
                $and: [{ precio: { $gte: req.body.precio1 } }, { precio: { $lte: req.body.precio2 } }]
              }, { limit: 8, page: pagin, sort: { fecha: -1 } }) //await AgregarProductos.find({brevedescripcion:{"$regex":id}})
              console.log(resultado)
              res.json(resultado)
            } else {
              const resultado = await AgregarProductos.paginate({ brevedescripcion: { "$regex": catego }, paiz: req.body.pais, ciudad: req.body.ciudad, }, { limit: 8, page: pagin, sort: { fecha: -1 } }) //await AgregarProductos.find({brevedescripcion:{"$regex":id}})
              console.log(resultado)
              res.json(resultado)
            }

          }

        }
      } else {
        if (id.slice(0, 1) == "a") {
          console.log(id.slice(1, 2), "categoria")
          catego = id.slice(1, 2)
          pagin = Number(id.slice(2,))
          console.log(id, "categoria")
          if (req.body.precio1 && req.body.precio2) {
            const producto = await AgregarProductos.paginate({
              categoria: catego,
              $and: [{ precio: { $gte: req.body.precio1 } }, { precio: { $lte: req.body.precio2 } }]
            }, { limit: 8, page: pagin, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)
          } else {
            const producto = await AgregarProductos.paginate({ categoria: catego }, { limit: 8, page: pagin, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)
          }

        } else if (id.slice(0, 1) == "b") {
          console.log(id.slice(1, 3), "subcategoria")
          catego = id.slice(1, 3)
          pagin = Number(id.slice(3,))
          console.log(id, "subcategoria")
          if (req.body.precio1 && req.body.precio2) {
            const producto = await AgregarProductos.paginate({
              subcategoria: catego,
              $and: [{ precio: { $gte: req.body.precio1 } }, { precio: { $lte: req.body.precio2 } }]
            }, { limit: 8, page: pagin, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)
          } else {
            const producto = await AgregarProductos.paginate({ subcategoria: catego }, { limit: 8, page: pagin, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)
          }


        } else if (id.slice(0, 1) == "c") {
          console.log(id.slice(1, 4), "subsubcategoria")
          catego = id.slice(1, 4)
          pagin = Number(id.slice(4,))
          console.log(id, "subsubcategoria")
          if (req.body.precio1 && req.body.precio2) {
            const producto = await AgregarProductos.paginate({
              subsubcategoria: catego,
              $and: [{ precio: { $gte: req.body.precio1 } }, { precio: { $lte: req.body.precio2 } }]
            }, { limit: 8, page: pagin, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)
          } else {
            const producto = await AgregarProductos.paginate({ subsubcategoria: catego }, { limit: 8, page: pagin, sort: { fecha: -1 } })
            console.log(producto)
            res.json(producto)
          }

        } else if (id.slice(0, 1) == "d") {
          if (Number(id.slice(1, 3))) {
            console.log(id.slice(1, 4), "palabra")//ok
            catego = id.slice(3,)
            pagin = Number(id.slice(1, 3))
            console.log(id, "categoria")
            if (req.body.precio1 && req.body.precio2) {
              const resultado = await AgregarProductos.paginate({
                brevedescripcion: { "$regex": catego },
                $and: [{ precio: { $gte: req.body.precio1 } }, { precio: { $lte: req.body.precio2 } }]
              },
                { limit: 8, page: pagin, sort: { fecha: -1 } }) //await AgregarProductos.find({brevedescripcion:{"$regex":id}})
              console.log(resultado)
              res.json(resultado)
            } else {
              const resultado = await AgregarProductos.paginate({ brevedescripcion: { "$regex": catego } }, { limit: 8, page: pagin, sort: { fecha: -1 } }) //await AgregarProductos.find({brevedescripcion:{"$regex":id}})
              console.log(resultado)
              res.json(resultado)
            }

          } else {
            console.log(id.slice(1, 4), "palabra")
            catego = id.slice(2,)
            pagin = Number(id.slice(1, 2))
            console.log(id, "categoria")
            if (req.body.precio1 && req.body.precio2) {
              const resultado = await AgregarProductos.paginate({
                brevedescripcion: { "$regex": catego },
                $and: [{ precio: { $gte: req.body.precio1 } }, { precio: { $lte: req.body.precio2 } }]
              }, { limit: 8, page: pagin, sort: { fecha: -1 } }) //await AgregarProductos.find({brevedescripcion:{"$regex":id}})
              console.log(resultado)
              res.json(resultado)
            } else {
              const resultado = await AgregarProductos.paginate({ brevedescripcion: { "$regex": catego } }, { limit: 8, page: pagin, sort: { fecha: -1 } }) //await AgregarProductos.find({brevedescripcion:{"$regex":id}})
              console.log(resultado)
              res.json(resultado)
            }

          }

        }
      }

    }
  } catch (error) {
    res.json([])
  }
})

/*RUTA PARA OBTENER ARTICULOS PARA EL VERCATEGORIA CON PAGINACION INFINITY SCROLL DEL FRONT END*/
route.post("/paginacion_categorias/:id", async (req, res) => {
  try {
    const { id } = req.params
    const pages = req.body.page
    const precio1 = req.body.precio1
    const precio2 = req.body.precio2
    const pais = req.body.pais
    const ciudad = req.body.ciudad
    const indicator = req.body.indicator


    if (precio1 && pais && ciudad === "") {



      if (indicator === "cat") {
        const producto = await AgregarProductos.paginate({
          categoria: id,
          paiz: pais,
          ciudad: req.body.ciudad,
          $and: [{ precio: { $gte: precio1 } }, { precio: { $lte: precio2 } }]
        }, { limit: 8, page: pages, sort: { fecha: -1 } })
        console.log(producto)
        res.json(producto)
      }


      if (indicator === "catsub") {
        const producto = await AgregarProductos.paginate({
          subcategoria: id,
          paiz: pais,
          ciudad: req.body.ciudad,
          $and: [{ precio: { $gte: precio1 } }, { precio: { $lte: precio2 } }]
        }, { limit: 8, page: pages, sort: { fecha: -1 } })
        console.log(producto)
        res.json(producto)
      }
      if (indicator === "catsubsub") {
        const producto = await AgregarProductos.paginate({
          subsubcategoria: id,
          paiz: pais,
          ciudad: req.body.ciudad,
          $and: [{ precio: { $gte: precio1 } }, { precio: { $lte: precio2 } }]
        }, { limit: 8, page: pages, sort: { fecha: -1 } })
        console.log(producto)
        res.json(producto)
      }
      if (indicator === "clave") {
        const producto = await AgregarProductos.paginate({
          nombre: { "$regex": id },
          paiz: pais,
          ciudad: req.body.ciudad,
          $and: [{ precio: { $gte: precio1 } }, { precio: { $lte: precio2 } }]
        }, { limit: 8, page: pages, sort: { fecha: -1 } })
        console.log(producto)
        res.json(producto)
      }
    }

    if (precio1 === 0 && pais && ciudad === "") {

      if (indicator === "cat") {
        const producto = await AgregarProductos.paginate({
          categoria: id,
          paiz: pais,
        }, { limit: 8, page: pages, sort: { fecha: -1 } })
        console.log(producto)
        res.json(producto)
      }


      if (indicator === "catsub") {
        const producto = await AgregarProductos.paginate({
          subcategoria: id,
          paiz: pais,
        }, { limit: 8, page: pages, sort: { fecha: -1 } })
        console.log(producto)
        res.json(producto)
      }
      if (indicator === "catsubsub") {
        const producto = await AgregarProductos.paginate({
          subsubcategoria: id,
          paiz: pais,
        }, { limit: 8, page: pages, sort: { fecha: -1 } })
        console.log(producto)
        res.json(producto)
      }
      if (indicator === "clave") {
        console.log(id, "aaaaaaaaaaaaa")
        const producto = await AgregarProductos.paginate({
          nombre: { "$regex": id },
          paiz: pais,
        }, { limit: 8, page: pages, sort: { fecha: -1 } })
        console.log(producto)
        res.json(producto)
      }
    }

    if (precio1 === 0 && pais && ciudad) {
      console.log(id, pages, indicator)


      if (indicator === "cat") {
        const producto = await AgregarProductos.paginate({
          categoria: id,
          paiz: pais,
          ciudad: req.body.ciudad
        }, { limit: 8, page: pages, sort: { fecha: -1 } })
        console.log(producto)
        res.json(producto)
      }


      if (indicator === "catsub") {
        const producto = await AgregarProductos.paginate({
          subcategoria: id,
          paiz: pais,
          ciudad: req.body.ciudad
        }, { limit: 8, page: pages, sort: { fecha: -1 } })
        console.log(producto)
        res.json(producto)
      }
      if (indicator === "catsubsub") {
        const producto = await AgregarProductos.paginate({
          subsubcategoria: id,
          paiz: pais,
          ciudad: req.body.ciudad
        }, { limit: 8, page: pages, sort: { fecha: -1 } })
        console.log(producto)
        res.json(producto)
      }
      if (indicator === "clave") {
        const producto = await AgregarProductos.paginate({
          nombre: { "$regex": id },
          paiz: pais,
          ciudad: req.body.ciudad
        }, { limit: 8, page: pages, sort: { fecha: -1 } })
        console.log(producto)
        res.json(producto)
      }
    }

    if (precio1 && pais && ciudad) {
      console.log(id, pages, indicator)

      if (indicator === "cat") {
        const producto = await AgregarProductos.paginate({
          categoria: id,
          paiz: pais,
          ciudad: ciudad,
          $and: [{ precio: { $gte: precio1 } }, { precio: { $lte: precio2 } }]
        }, { limit: 8, page: pages, sort: { fecha: -1 } })
        console.log(producto)
        res.json(producto)
      }


      if (indicator === "catsub") {
        const producto = await AgregarProductos.paginate({
          subcategoria: id,
          paiz: pais,
          ciudad: ciudad,
          $and: [{ precio: { $gte: precio1 } }, { precio: { $lte: precio2 } }]
        }, { limit: 8, page: pages, sort: { fecha: -1 } })
        console.log(producto)
        res.json(producto)
      }
      if (indicator === "catsubsub") {
        const producto = await AgregarProductos.paginate({
          subsubcategoria: id,
          paiz: pais,
          ciudad: ciudad,
          $and: [{ precio: { $gte: precio1 } }, { precio: { $lte: precio2 } }]
        }, { limit: 8, page: pages, sort: { fecha: -1 } })
        console.log(producto)
        res.json(producto)
      }
      if (indicator === "clave") {
        const producto = await AgregarProductos.paginate({
          nombre: { "$regex": id },
          paiz: pais,
          ciudad: ciudad,
          $and: [{ precio: { $gte: precio1 } }, { precio: { $lte: precio2 } }]
        }, { limit: 8, page: pages, sort: { fecha: -1 } })
        console.log(producto)
        res.json(producto)
      }
    }


    if (precio1 === "" && pais && ciudad) {
      console.log(id, pages, indicator)

      if (indicator === "cat") {
        const producto = await AgregarProductos.paginate({
          categoria: id,
          paiz: pais,
          ciudad: req.body.ciudad
        }, { limit: 8, page: pages, sort: { fecha: -1 } })
        console.log(producto)
        res.json(producto)
      }


      if (indicator === "catsub") {
        const producto = await AgregarProductos.paginate({
          subcategoria: id,
          paiz: pais,
          ciudad: req.body.ciudad
        }, { limit: 8, page: pages, sort: { fecha: -1 } })
        console.log(producto)
        res.json(producto)
      }
      if (indicator === "catsubsub") {
        const producto = await AgregarProductos.paginate({
          subsubcategoria: id,
          paiz: pais,
          ciudad: req.body.ciudad
        }, { limit: 8, page: pages, sort: { fecha: -1 } })
        console.log(producto)
        res.json(producto)
      }
      if (indicator === "clave") {
        const producto = await AgregarProductos.paginate({
          nombre: { "$regex": id },
          paiz: pais,
          ciudad: req.body.ciudad
        }, { limit: 8, page: pages, sort: { fecha: -1 } })
        console.log(producto)
        res.json(producto)
      }


    }
  } catch (error) {
    res.json([])
  }
})

/********** */
/******************************************************** */


//PARA  LLEVAR DATOS EN EL HOME CON INFINITISCROLL

route.post("/infiniti_scroll_home/:id", async (req, res) => {
  try {
    const { id } = req.params
    const pages = req.body.page
    const precio1 = req.body.precio1
    const precio2 = req.body.precio2
    const pais = req.body.pais
    const ciudad = req.body.ciudad
    const indicator = req.body.indicator

    if (req.body.pais && req.body.ciudad === "") {
      const productos = await AgregarProductos.paginate({ paiz: pais }, { limit: 10, page: pages, sort: { fecha: -1 } })
      console.log(productos)
      res.json(productos)
    }
  } catch (error) {
    res.json([])
  }
})

/********** */
/******************************************************** */



/*RUTA PARA BUSCAR ARTICULOS CON EL BUSCADOR */

route.post("/buscar", async (req, res) => {

  try {
    const clave = req.body.clave.toLowerCase()
    console.log(clave)

    console.log(req.body)
    if (req.body.pais && req.body.ciudad === "") {
      if (/*req.body.precio1 &&*/ req.body.precio2) {

        const resultado = await AgregarProductos.paginate({
          nombre: { "$regex": clave },
          paiz: req.body.pais,
          $and: [/*{ precio: { $gte: req.body.precio1 } }, */{ precio: { $lte: req.body.precio2 } }]
        }, { limit: 8 })//await AgregarProductos.find({brevedescripcion:{"$regex":clave}})

        console.log(resultado)
        res.json(resultado)

      } else {
        const resultado = await AgregarProductos.paginate({ nombre: { "$regex": clave }, paiz: req.body.pais }, { limit: 8 })//await AgregarProductos.find({brevedescripcion:{"$regex":clave}})
        console.log(resultado, "aaaaaaaaaaaaaaaaaaaaa")
        res.json(resultado)

      }

    } else {
      if (req.body.pais && req.body.ciudad) {
        if (/*req.body.precio1 && */req.body.precio2) {
          const resultado = await AgregarProductos.paginate({
            nombre: { "$regex": clave },
            paiz: req.body.pais,
            ciudad: req.body.ciudad,
            $and: [/*{ precio: { $gte: req.body.precio1 } }, */{ precio: { $lte: req.body.precio2 } }]
          }, { limit: 8 })//await AgregarProductos.find({brevedescripcion:{"$regex":clave}})
          console.log(resultado)
          res.json(resultado)
        } else {
          const resultado = await AgregarProductos.paginate({ nombre: { "$regex": clave }, paiz: req.body.pais, ciudad: req.body.ciudad }, { limit: 8 })//await AgregarProductos.find({brevedescripcion:{"$regex":clave}})
          console.log(resultado)
          res.json(resultado)
        }

      } else {
        if (/*req.body.precio1 && */req.body.precio2) {
          const resultado = await AgregarProductos.paginate({
            nombre: { "$regex": clave },
            $and: [/*{ precio: { $gte: req.body.precio1 } }, */{ precio: { $lte: req.body.precio2 } }]
          },
            { limit: 8 })//await AgregarProductos.find({brevedescripcion:{"$regex":clave}})
          console.log(resultado)
          res.json(resultado)
        } else {
          const resultado = await AgregarProductos.paginate({ nombre: { "$regex": clave } }, { limit: 8 })//await AgregarProductos.find({brevedescripcion:{"$regex":clave}})
          console.log(resultado)
          res.json(resultado)
        }

      }
    }
  } catch (error) {
    res.json([])
  }
})

/********** */
/******************************************************** */


/*RUTA PARA OBTENER RESULTADOS DE BUSQUEDA*/

route.post("/resultados_busqueda", async (req, res) => {

  try {
    const clave = req.body.clave.toLowerCase()
    console.log(clave)
    if (req.body.pais && req.body.ciudad === "") {
      const resultado = await AgregarProductos.paginate({ nombre: { "$regex": clave }, paiz: req.body.pais }, { limit: 8 })//await AgregarProductos.find({brevedescripcion:{"$regex":clave}})
      console.log(resultado)
      res.json(resultado)
    } else {
      if (req.body.pais && req.body.ciudad) {
        const resultado = await AgregarProductos.paginate({ nombre: { "$regex": clave }, paiz: req.body.pais, ciudad: req.body.ciudad }, { limit: 8 })//await AgregarProductos.find({brevedescripcion:{"$regex":clave}})
        console.log(resultado)
        res.json(resultado)
      } else {
        const resultado = await AgregarProductos.paginate({ nombre: { "$regex": clave } }, { limit: 8 })//await AgregarProductos.find({brevedescripcion:{"$regex":clave}})
        console.log(resultado)
        res.json(resultado)
      }
    }
  } catch (error) {
    res.json([])
  }

})

/********** */

/******************************************************** */


/*RUTA PARA OBTENER ARTICULOS DEL USER EN EN ESPECIFICO*/

route.post("/articulos_user/:id", async (req, res) => {
  const { id } = req.params

  try {
    if (id) {
      const productos = await AgregarProductos.paginate({ user_id: id }, { sort: { fecha: -1 } })
      console.log(productos)
      res.json(productos)
    }
  } catch (error) {
    res.json("error")
  }

})

/********** */

/******************************************************** */
/***********PARA ELIMINAR PRODUCTO */
/*********************************************** */

route.post("/user_eliminar_product/:id", async (req, res) => {
  try {
    const { id } = req.params
    var query = { _id: id };
    const users = await AgregarProductos.deleteOne(query);
    console.log(users)
    res.json("Articulo borrado !")
  } catch (error) {
    res.json("hay un problema")
  }
})
/******************************************************** */


/*RUTA PARA OBTENER LAS AGENCIAS DE SERVICIOS EN LA VISTA HOME*/
/*******INACTIVO */
route.post("/obtener_agencias_servicios", async (req, res) => {
  const { id } = req.params

  try {
    if (true) {
      const productos = await User.paginate({ estado: false, categoria: "011111" }, { sort: { updatedAt: -1 }, projection: { email: 0, password: 0, token: 0 } })
      console.log(productos)
      res.json(productos)
    }
  } catch (error) {
    res.json([])
  }

})

/********** */

/******************************************************** */
/******************************************************** */





/************************************************************* */
/**********************OBTENER TODAS LAS AGENCIAS */
/******************************************************************** */
route.post("/obtener_tiendas_agencias_venta", async (req, res) => {
  const { id } = req.params
  try {
    if (true) {
      const productos = await User.paginate({ selectForm: "0202", estado: true /*$or: [{ selectForm: "011111"},{ categoria: "033333"},{ categoria: "022222"}] */ }, { sort: { updatedAt: -1 }, projection: { email: 0, password: 0, token: 0 } })
      console.log(productos)
      res.json(productos)
    }
  } catch (error) {
    res.json([])
  }

})
/************************************************* */
/******************OBTENER DATOS DE LA AGENCIA PARA CLIENTES VISITANTES DE LA APLICACION WEB */
/***************************** */
route.post("/obtener_tienda_agencia_venta_simple/:id", async (req, res) => {
  const { id } = req.params

  try {
    if (true) {
      const productos = await User.paginate({ _id: id }, { sort: { updatedAt: -1 }, projection: { email: 0, password: 0, token: 0 } })
      console.log(productos)
      res.json(productos)
    }
  } catch (error) {
    res.json([])
  }

})

/********** */

/******************************************************** */

/******************************************** */
/**************************OBTENER DATOS DE LA AGENCIAS UNA VEZ QUE EL USUARIO DE LA AGENCIA INICIA SESION */
/************************************************* */
route.post("/obtener_user_agencias_tiendas_simple/:id", async (req, res) => {
  const { id } = req.params

  try {
    if (true) {
      const productos = await User.findById(id)
      console.log(productos)
      res.json(productos)
    }
  } catch (error) {
    res.json([])
  }

})

/********** */

/******************************************************** */

/************************************************* */
/*
route.post("/obtener_productos_user_agencias_tiendas_simple/:id", async (req, res) => {
  const { id } = req.params
  try {
    if (true) {
      const productos = await AgregarProductos.paginate({ user_id: id }, { sort: { fecha: -1 } })
      console.log(productos)
      res.json(productos)
    }
  } catch (error) {
    res.json([])
  }

})
*/
/********** */

/******************************************************** */
/********************SUBIR LAS IMAGENES DE AGENCIAS DE SERVICIOS *********** */
/************************************************* */

route.post("/subir-imagenes-user-agencia", async (req, res) => {
  const { user_id, codeVery } = req.body

  try {
    if (true) {
      if (req.files["imagen1"][0]) {
        console.log(req.files["imagen1"][0])
        const subirImagenes = new modeloImagenesAgencia()
        subirImagenes.urlImg = "http://localhost:5000/img/" + req.files["imagen1"][0].filename
        subirImagenes.codeVery = codeVery
        subirImagenes.user_id = user_id
        await subirImagenes.save()
      }
      if (req.files["imagen2"][0]) {
        const subirImagenes = new modeloImagenesAgencia()
        subirImagenes.urlImg = "http://localhost:5000/img/" + req.files["imagen2"][0].filename
        subirImagenes.codeVery = codeVery
        subirImagenes.user_id = user_id
        await subirImagenes.save()
      }
      if (req.files["imagen3"][0]) {
        const subirImagenes = new modeloImagenesAgencia()
        subirImagenes.urlImg = "http://localhost:5000/img/" + req.files["imagen3"][0].filename
        subirImagenes.codeVery = codeVery
        subirImagenes.user_id = user_id
        await subirImagenes.save()
      }
      if (req.files["imagen4"][0]) {
        const subirImagenes = new modeloImagenesAgencia()
        subirImagenes.urlImg = "http://localhost:5000/img/" + req.files["imagen4"][0].filename
        subirImagenes.codeVery = codeVery
        subirImagenes.user_id = user_id
        await subirImagenes.save()
      }
      res.json("imagenes publicados")
    }
  } catch (error) {
    res.json([])
  }

})

/********** */

/******************************************************** */

/******************************************************** */
/************ OBTENER IMAGENES DE AGENCIA DE SERVICIO PARA VISITANTES */
/************************************************* */

route.post("/obtener-imagenes-user-agencia/:id", async (req, res) => {
  const { id } = req.params
  console.log(id)
  try {
    if (true) {
      const productos = await modeloImagenesAgencia.paginate({ user_id: id }, { sort: { fecha: -1 } })
      console.log(productos)
      res.json(productos)
    }
  } catch (error) {
    res.json([])
  }

})

/*
route.post("/text", async (req, res) => {
  try {
    console.log(req.files)

    res.json([])
  } catch (error) {
    res.json([])
  }
})
*/
/********** */

/******************************************************** */




//exportar rutas
module.exports = route