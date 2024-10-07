const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res = response ) =>{
    
    const { email, password } = req.body;   // De la request desestructuramos el email y el password

    try {
        let usuario = await Usuario.findOne({ email }); // De todos los usuarios existentes buscamos uno en específico por su email
        
        // Si hay un usuario con el mismo email, lanzará un Bad Request indicando que el usuario ya existe
        if ( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
        }
        
        // Crea el usuario
        usuario = new Usuario( req.body );


        // Encriptar contraseña con bcrypt
        const salt = bcrypt.genSaltSync();  // Da 10 vueltas para encriptar la contraseña
        usuario.password = bcrypt.hashSync( password, salt );   // Indicamos que la contraseña del usuario será encriptada

        // Guarda el usuario en la BD
        await usuario.save();

        // Generar JWT el cual recibe el id y el nombre del usuario
        const token = await generarJWT( usuario.id, usuario.name );

        // Retorna id, nombre y token del usuario creado
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const loginUsuario =  async(req, res = response) =>{

    const { email, password } = req.body;   // Desestructuramos el email y la contraseña de la request

    try {
        const usuario = await Usuario.findOne({ email });   // Buscamos el email del usuario ya que este es unico para cada usuario

        // El email no fue encontrado en la base de datos y por ende no existe dicho usuario
        if ( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // Confirmar las contraseñas tanto de la request como la del usuario de la BD sean las mismas 
        const validPassword = bcrypt.compareSync( password, usuario.password );

        // Si las contraseñas no coinciden...
        if ( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar JWT el cual recibe el id y el nombre del usuario
        const token = await generarJWT( usuario.id, usuario.name );

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const revalidarToken = async(req, res = response) =>{
    
    const { uid, name } = req;  // Desestructuramos el uid y el name de la request

    // Generar JWT y retornarlo en la petición
    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}