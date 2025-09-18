const path = require("path");

/*
 * Toma las variables de .env. Asi otro desarrollador sabra que variables
 * debe incluir su version de archivo .env
 */

//////RESPUESTAS//////////

const RES_CREATE = 'Operacion exitosa';
const RES_GET = 'ok';
const RES_UPDATE = 'Datos actualizados';
const RES_DELETE = 'Operacion exitosa';
const RES_NO_PERMISION = 'Operacion rechazada';
const RES_NO_SAM_DATA = 'Ya existe una cuenta con el nombre o correo introducido';
const RES_NO_PERMISION_LOGIN = 'Correo o contraseña incorrectos';
const RES_DATA_INCOMPLETE = 'Revisa el formulario';
const RES_ERROR = 'Hay un problema';
const RES_TOKEN_EXPIRED = 'Por favor vuelva iniciar sesion';
const code503 = 503;
const code403 = 403;

//////////////////////////


const MONGODB_URI = process.env.DB;
const SECRET_TOKEN = process.env.SESSION_SECRET
const EMAIL_CODE = process.env.EMAIL_CODE
const URL_FILE = process.env.URL_FILE || "http://localhost:6500/files/";

const PUBLIC_DIR_ESEGG = path.join(__dirname, "public");

module.exports = {
  RES_NO_SAM_DATA,
  RES_NO_PERMISION_LOGIN,
  code503,
  RES_TOKEN_EXPIRED,
  MONGODB_URI,
  PUBLIC_DIR_ESEGG,
  RES_CREATE,
  RES_DELETE,
  RES_DATA_INCOMPLETE,
  RES_NO_PERMISION,
  RES_ERROR,
  RES_GET,
  RES_UPDATE,
  SECRET_TOKEN,
  EMAIL_CODE,
  URL_FILE,
  code403
};