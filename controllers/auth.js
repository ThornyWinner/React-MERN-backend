//* crearUsuario: Crea un nuevo usuario en la base de datos si el email no está registrado, encripta su contraseña y genera un JWT para autenticar al usuario.
//* loginUsuario: Permite iniciar sesión verificando el email y la contraseña, luego genera un JWT si las credenciales son correctas.
//* revalidarToken: Genera un nuevo JWT cuando el token anterior ha caducado o está a punto de hacerlo.
//* Cada función maneja errores y envía respuestas adecuadas al cliente


// Importamos las dependencias necesarias
const { response } = require('express');
const bcrypt = require('bcryptjs'); // Para encriptar las contraseñas
const Usuario = require('../models/Usuario');   // El modelo de Usuario
const { generarJWT } = require('../helpers/jwt');   // Función para generar el token JWT
const {enviarMailVerificacion} = require('../services/mail.service.js')

// Función para crear un nuevo usuario
const crearUsuario = async(req, res = response ) =>{
    
    const { email, password } = req.body;   // Desestructuramos el email y password de la solicitud

    try {
        let usuario = await Usuario.findOne({ email }); // Buscamos si ya existe un usuario con ese email
        
        // Si el usuario ya existe, enviamos un error
        if ( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
        }
        
        // Crea un nuevo usuario con los datos recibidos
        usuario = new Usuario( req.body );


        // Encriptamos la contraseña antes de guardarla
        const salt = bcrypt.genSaltSync();  // Generamos un salt para la encriptación
        usuario.password = bcrypt.hashSync( password, salt );   // Encriptamos la contraseña

        // Guardamos el usuario en la base de datos
        await usuario.save();

        // Generamos un token JWT usando el id y el nombre del usuario
        const token = await generarJWT( usuario.id, usuario.name );

        //Enviar el mail de verificación al cliente
        const mail = await enviarMailVerificacion(email, "Token")
        console.log(mail)
        if (mail.accepted === 0) {
            return res(500).send({ status: "error", message: "Error enviando mail de verificación" })
        }

        // Respondemos con el id, nombre y token del nuevo usuario
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error); // Mostramos el error en la consola para depuración
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// Función para el inicio de sesión (login)
const loginUsuario =  async(req, res = response) =>{

    const { email, password } = req.body;   // Desestructuramos el email y la contraseña de la solicitud

    try {
        const usuario = await Usuario.findOne({ email });   // Buscamos al usuario por su email

        // Si no existe el usuario, devolvemos un error
        if ( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // Verificamos que la contraseña proporcionada coincida con la guardada
        const validPassword = bcrypt.compareSync( password, usuario.password );

        // Si la contraseña no es válida, enviamos un error
        if ( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generamos un JWT con el id y nombre del usuario
        const token = await generarJWT( usuario.id, usuario.name );

        // Respondemos con los datos del usuario y el token
        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error); // Mostramos el error en la consola para depuración
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// Función para revalidar el token
const revalidarToken = async(req, res = response) =>{
    
    const { uid, name } = req;  // Desestructuramos el uid y el nombre del usuario del request

    // Generamos un nuevo token
    const token = await generarJWT( uid, name );

    // Respondemos con el nuevo token
    res.json({
        ok: true,
        uid, 
        name,
        token
    })
}

// Exportamos las funciones para que puedan ser usadas en otros archivos
module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}