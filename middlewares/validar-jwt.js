//* Este código define un middleware para Express llamado validarJWT, que valida el JSON Web Token (JWT) presente en los encabezados de las solicitudes. 
//* El middleware se asegura de que el token sea válido, y si es así, extrae la información del usuario (como uid y name) y la adjunta al objeto req para 
//* que esté disponible en los controladores posteriores.
//* Extracción del token: El token es tomado del encabezado x-token. Si no se encuentra, se envía una respuesta con un código de estado 401 (Unauthorized) 
//*                       y un mensaje de error.
//* Verificación del token: El método jwt.verify() se utiliza para validar el token y verificar que no ha sido alterado. Se usa una clave secreta 
//*                         (SECRET_JWT_SEED), almacenada en las variables de entorno, para esta verificación.Si el token es válido, se extraen los datos 
//*                         (uid y name) del payload del token y se asignan al objeto req para que estén disponibles en los controladores que siguen.
//* Errores en el token: Si el token no es válido o ha expirado, se lanza una excepción que se captura y retorna un mensaje de error, indicando que el token no es válido.
//* Uso de next(): Si el token es válido, el middleware llama a next(), lo que permite que la solicitud continúe hacia el siguiente middleware o controlador de ruta.

const { response } = require('express');    // Se importa 'response' de Express para tipado
const jwt = require('jsonwebtoken');    // Se importa jsonwebtoken para manejar JWT

const validarJWT = ( req, res = response, next ) => {
    
    // Se extrae el token del encabezado de la solicitud
    const token = req.header('x-token');

    // Si no hay token en la solicitud
    if ( !token ){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'  // Mensaje de error
        });
    }

    try {
        
        // Verifica y decodifica el token
        const { uid, name } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED // Clave secreta usada para la firma del token
        );

        // Se añade el uid y el nombre del usuario decodificado al objeto 'req'
        req.uid = uid;
        req.name = name;

    } catch (error) {
        // Si la verificación falla, se devuelve un error 401 (No autorizado)
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    // Si todo está bien, continúa con el siguiente middleware/controlador
    next();
}

module.exports = {
    validarJWT
}