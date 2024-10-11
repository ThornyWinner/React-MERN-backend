//* Este código define un modelo para un "Evento" en MongoDB, con campos para título, notas, 
//* fecha de inicio, fecha de fin y una referencia al usuario que creó el evento. También incluye 
//* un método para personalizar el formato JSON cuando se convierte el documento para eliminar ciertos campos internos.


// Importamos las funciones Schema y model de mongoose
const { Schema, model } = require('mongoose');

// Definimos un nuevo esquema para el modelo de Evento
const EventoSchema = Schema({
    // El campo 'title' será de tipo String y es obligatorio
    title: {
        type: String,
        required: true
    },
    // El campo 'notes' será de tipo String y es opcional
    notes: {
        type: String
    },
    // El campo 'start' será de tipo Date y es obligatorio (fecha de inicio del evento)
    start: {
        type: Date,
        required: true
    },
    // El campo 'end' será de tipo Date y es obligatorio (fecha de finalización del evento)
    end: {
        type: Date,
        required: true
    },
    // El campo 'user' será una referencia al ID del usuario que crea el evento. Es obligatorio
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', // Hace referencia al modelo 'Usuario'
        required: true
    }

});

// Método para modificar el formato de salida JSON al convertir un objeto Evento
EventoSchema.method('toJSON', function () {
    // Extrae el campo __v (versión) y _id (identificador) y crea un nuevo objeto con el resto de los campos
    const { __v, _id, ...object } = this.toObject();
    // Reemplaza el campo _id con id
    object.id = _id;
    return object;
});

// Exportamos el modelo de Evento basado en el esquema EventoSchema
module.exports = model('Evento', EventoSchema);