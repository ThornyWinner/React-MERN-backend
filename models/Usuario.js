//* Este código define un modelo para un usuario en MongoDB usando Mongoose, 
//* con campos para nombre, correo electrónico y contraseña, asegurándose de 
//* que los campos requeridos estén presentes y que el correo sea único.


// Importamos las funciones Schema y model de mongoose
const { Schema, model } = require('mongoose');

// Definimos un nuevo esquema para el modelo de Usuario
const UsuarioSchema = Schema({
    // El campo 'name' será de tipo String y es obligatorio
    name: {
        type: String,
        required: true
    },
    // El campo 'email' será de tipo String, obligatorio y debe ser único
    email: {
        type: String,
        required: true,
        unique: true
    },
    // El campo 'password será de tipo String y es obligatorio
    password: {
        type: String,
        required: true
    }
});

// Exportamos el modelo de Usuario basado en el esquema UsuarioSchema
module.exports = model('Usuario', UsuarioSchema);