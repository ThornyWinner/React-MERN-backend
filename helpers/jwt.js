//* Uso de jsonwebtoken: La función usa jwt.sign() para firmar un token. Toma el payload (los datos del usuario) 
// *                     y la firma con una clave secreta (SECRET_JWT_SEED) que debe estar configurada como una variable de entorno.
//* Promesa: Esta función devuelve una promesa. Si el proceso de generación del token falla (por ejemplo, si hay un error en la firma), 
//*          la promesa es rechazada (reject). Si se genera correctamente, la promesa se resuelve con el token.
//* Expiración del token: El token generado tiene una expiración de 2 horas, lo que significa que después de ese tiempo, 
//*                       el token ya no será válido. Esto se especifica con la opción expiresIn: '2h'.


const jwt = require('jsonwebtoken');    // Importa la librería JSON Web Token (JWT)

const generarJWT = ( uid, name ) => {

    // Retorna una promesa
    return new Promise( (resolve, reject) =>{
        
        // El contenido del payload incluye el uid y el name
        const payload = { uid, name };  
        
        // Frima del token usando la clave secreta
        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h' // El token expira en 2 horas
        }, (err, token) =>{
            
            // Si ocurre un error al firmar el token
            if ( err ){
                console.log(err);
                reject('No se pudo generar el token');
            }

            // Si la firma del token fue exitosa, lo resolvemos
            resolve( token );
        });
    })
}

module.exports = {
    generarJWT  // Exporta la función para ser usada en otros archivos
}