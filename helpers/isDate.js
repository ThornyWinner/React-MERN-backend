//* Uso de Moment.js: La función toma un valor y lo intenta convertit en una fecha utilizando la función moment(). 
//*                   Si la conversión es válida, entonces moment.isValid() retornará true. Si no es una fecha válida, retornará false.
//* Retorno condicional: El código inclye una simple verificación condicional para retornar true o false dependiendo de si la fecha es válida.
//* Caso de valor vacío: La función primero verifica si el valor proporcionado es null o undefined, y si lo es, retorna false inmediatamente 
//*                      sin intentar convertirlos en una fecha.

const moment = require ('moment');  // Importa la biblioteca Moment.js

const isDate = ( value ) => {
    
    // Si no se proporciona un valor, retorna false
    if ( !value ){
        return false;
    }

    // Crea una instancia de Moment con el valor proporcionada
    const fecha = moment( value );
    // Verifica si la fecha es v+alida y retorna true o false
    if ( fecha.isValid() ){
        return true;
    } else {
        return false;
    }

}

module.exports = { isDate };    // Exporta la función para ser utilizada en otros módulos