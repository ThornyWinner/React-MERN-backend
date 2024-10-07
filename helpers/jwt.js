const jwt = require('jsonwebtoken');

const generarJWT = ( uid, name ) => {

    // Retorna una promesa
    return new Promise( (resolve, reject) =>{
        
        // Contenido del payload
        const payload = { uid, name };  
        
        // Hacemos la firma del token
        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
        }, (err, token) =>{
            
            // Si existe un error
            if ( err ){
                console.log(err);
                reject('No se pudo generar el token');
            }

            // Si todo sale de manera correcta mandamos el resolve
            resolve( token );
        });
    })
}

module.exports = {
    generarJWT
}