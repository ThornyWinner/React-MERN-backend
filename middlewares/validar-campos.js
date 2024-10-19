//* Este código define un middleware llamado validarCampos para usar en una aplicación de Express. Este middleware se utiliza para validar los datos que llegan 
//* en las solicitudes HTTP y verificar si se cumplen ciertas reglas definidas previamente (usando, por ejemplo, express-validator). Si hay errores de validación, 
//* responde con un estado HTTP 400 y un objeto JSON con los errores. Si no hay errores, llama al siguiente middleware o función controladora con next().
//* validationResult(req): Esta función de express-validator recopila los errores de validación que hayan ocurrido en la solicitud(req).
//*                        Los errores se acumulan a partir de validaciones previas, como las que se definen usando middlewares específicos (por ejemplo, check).
//* Control de errores: Si la función validationResult(req) devuelve errores (es decir, si !errors.isEmpty()), se envía una respuesta HTTP con código 400 (Bad Request) 
//*                     y un objeto JSON que contiene los errores. Los errores se mapean usando .mapped(), lo que genera un objeto donde las claves son los campos 
//*                     validados y los valores contienen mensajes detallados sobre el error.
//* next(): Si no hay errores, el middleware invoca next(), lo que permite continuar con el siguiente middleware o la ruta correspondiente.


const { response } = require('express');    // Se importa 'response' de Express para tipado
const { validationResult } = require('express-validator');  // Para obtener los resultados de la validación

const validarCampos = (req, res = response, next) => {
    
    // Obtiene los errores de validación del request
    const errors = validationResult( req );
    
    // Si hay errores, responde con un 400 y los errores en formato JSON
    if( !errors.isEmpty() ){
        return res.status(400).json({
            ok: false,  // Indica que la validación falló
            errors: errors.mapped() // Mapea los errores a un objeto con detalles más legibles
        });
    }

    // Sino hay errores, pasa al siguiente middleware o controlador
    next();
}

module.exports = {
    validarCampos   // Se exporta el middleware para poder usarlo en otras partes de la aplicación
}