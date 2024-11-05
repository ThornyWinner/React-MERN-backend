/**
   Rutas de Usuarios / Autenticación (Auth)
   host + /api/auth
 */

//* router.post('/new'): Ruta para crear un nuevo usuario, con validaciones de campos como nombre, email y contraseña. Utiliza express-validator para 
//*                      las validaciones y el middleware validarCampos para verificar si hay errores antes de crear el usuario.
//* router.post('/'): Ruta para que un usuario inicie sesión. También valida los campos de email y contraseña con las mismas reglas que en la creación.
//* router.get('/renew'): Ruta para revalidar el token de autenticación JWT. Solo se puede acceder si el usuario ya tiene un JWT válido, el cual es 
//*                       validado por el middleware validarJWT.
//* Todos los campos son validados antes de enviar la petición a los controladores, garantizando que los datos estén en el formato correcto antes de procesarlos.


const { Router } = require('express');
const { check } = require('express-validator'); // Para validar los campos
const { validarCampos } = require('../middlewares/validar-campos'); // Middleware personalizado para validar los campos
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');  // Controladores para manejar la lógica de cada ruta
const { validarJWT } = require('../middlewares/validar-jwt');   // Middleware para validar el token JWT

// Creamos una nueva instancia del router de express
const router = Router();

// Ruta para crear un nuevo usuario
router.post(
    '/new', 
    [ // Middlewares para validar los campos antes de crear el usuario
        check('name', 'El nombre es obligatorio').not().isEmpty(),  // Vrifica que el nombre no esté vacío
        check('email', 'El email es obligatorio').isEmail().toLowerCase(),    // Verifica que el email tenga un formato válido
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min:6 }),   // Verifica que el password tenga al menos 6 caracteres
        validarCampos   // Middleware que verifica si hay errores en las validaciones anteriores
    ], 
    crearUsuario    // Controlador que maneja la creación del usuario
);

// Ruta para el inicio de sesión (login) de un usuario
router.post(
    '/',
    [ // Middlewares para validar los campos antes de hacer login
        check('email', 'El email es obligatorio').isEmail().toLowerCase(),    // Verifica que el email tenga un formato válido
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min:6 }),   // Verifica que el password tenga al menos 6 caracteres
        validarCampos   // Middleware que verifica si hay errores en las validaciones anteriores
    ],
    loginUsuario    // Controlador que maneja el inicio de sesión
);

// Ruta para revalidar el token de seguridad del usuario
router.get('/renew', validarJWT, revalidarToken);   // Middleware para validar el JWT antes de revalidar el token

// Exportamos el router para que pueda ser utilizado en otros archivos
module.exports = router;