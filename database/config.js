//* Manejo de la conexión: La función mongoose.connect() recibe como argumento la URL de conexión a la base de datos, 
//*                        que se toma de una variable de entorno process.env.DB_CNN. Esto permite flexibilidad en la 
//*                        configuración de la URL sin exponerla directamente en el código.
//* Estructura asíncrona: El uso de async/await permite que la conexión se realice de manera asíncrona, evitando que el 
//*                       proceso de conexión bloquee el hilo principal de la aplicación.
//* Manejo de errores: Si ocurre un error durante la conexión, se captura en el bloque catch, se imprime en la consola para diagnóstico,
//*                    y se lanza un error personalizado (throw new Error(...)).


const mongoose = require('mongoose');   // importa Mongoose para interactuar con MongoDb

// Función asíncrona para conectar a la base de datos
const dbConnection = async() => {

    try {

        //Intenta conectar con la base de datos usando la URL almacenada en una variable de entrono
        await mongoose.connect( process.env.DB_CNN );

        console.log('DB Online');   // Muestra un mensaje en la consola si la conexión es exitos

    }catch ( error ){
        console.log(error); // Imprime el error en la consola en caso de que falle la conexión
        throw new Error('Error a la hora de inicializar BD');   // Lanza un error personalizado si la conexión falla
    }
    
}

module.exports = {
    dbConnection    // Exporta la función para ser utilizada en otras partes de la aplicación
}