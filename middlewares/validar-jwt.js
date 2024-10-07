const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = ( req, res = response, next ) => {
    
    // x-token solicitado en los headers
    const token = req.header('x-token');

    // Si el token no viene en la petición
    if ( !token ){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {
        
        // Verifica que no haya alteraciones en el token 
        const { uid, name } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        req.uid = uid;
        req.name = name;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    // Si todo está correcto llama lo siguiente
    next();
}

module.exports = {
    validarJWT
}