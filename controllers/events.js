//* getEventos: Recupera todos los eventos de la base de datos y devuelve la información de los eventos junto con el nombre del usuario que los creó.
//* crearEvento: Permite crear un nuevo evento y lo guarda en la base de datos. El evento está asociado al usuario autenticado que lo creó.
//* actualizarEvento: Actualiza un evento existente solo si el usuario autenticado es el propietario del evento.
//* eliminarEvento: Elimina un evento solo si el usuario autenticado es el propietario del evento.
//* Cada función maneja errores y envía respuestas adecuadas según el resultado de las operaciones.


// Importamos la respuesta de express y el modelo de Evento
const { response } = require('express');
const Evento = require('../models/Evento');

// Función para obtener todos los eventos
const getEventos = async(req, res = response ) => {
    
    // Buscamos todos los eventos en la base de datos y populamos el campo 'user' con su 'name'
    const eventos = await Evento.find()
                                .populate('user', 'name');

    // Respondemos con la lista de eventos
    res.json({
        ok: true,
        eventos
    });
}

// Función para crear un nuevo evento
const crearEvento = async ( req, res = response ) => {
    
    // Creamos una nueva instancia del modelo Evento con los datos del cuerpo de la solicitud
    const evento =  new Evento( req.body );

    try {

        // Asignamos el usuario que crea el evento (usamos el uid del request, que es el id del usuario autenticado)
        evento.user = req.uid;
        
        // Guardamos el evento en la base de datos
        const eventoGuardado = await evento.save();

        // Respondemos con el evento guardado
        res.json({
            ok: true,
            evento: eventoGuardado
        });


    } catch (error) {
        console.log(error); // Mostramos el error en la consola para depuración
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

// Función para actualizar un evento existente
const actualizarEvento = async(req, res = response ) => {
    
    const eventoId = req.params.id; // Obtenemos el id del evento a actualizar desde los parámetros de la URL
    const uid = req.uid;    // Obtenemos el id del usuario autenticado

    try {

        // Buscamos el evento por su id
        const evento = await Evento.findById( eventoId );

        // Si no se encuentra el evento, devolvemos un error
        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        // Verificamos que el usuario que está intentando actualizar el evento sea el dueño del mismo
        if ( evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        // Creamos un nuevo objeto con los datos actualizados
        const nuevoEvento = {
            ...req.body,
            user: uid   // Aseguramos que el usuario dueño del evento se mantenga el mismo
        }

        // Actualizamos el evento en la base de datos
        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );

        // Respondemos con el evento actualizado
        res.json({
            ok: true,
            evento: eventoActualizado
        });

    } catch (error) {
        console.log(error); // Mostramos el error en la consola para depuración
        res.status(500).json({
            ok: false,
            msg:'Hable con el administrador'
        });
    }

}

// Función para eliminar un evento
const eliminarEvento = async(req, res = response ) => {

    const eventoId = req.params.id; // Obtenemos el id del evento a eliminar desde los parámetros de la URL
    const uid = req.uid;    // Obtenemos el id del usuario autenticado

    try {
        
        // Buscamos el evento por su id
        const evento = await Evento.findById( eventoId );

        // Si no se encuentra el evento, devolvemos un error
        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }
        
        // Verificamos que el usuario que está intentando eliminar el evento sea el dueño del mismo
        if ( evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            });
        }

        // Eliminamos el evento de la base de datos
        await Evento.findByIdAndDelete( eventoId );

        // Respondemos indicando que la operación fue exitosa
        res.json({ ok: true });


    } catch (error) {
        console.log(error); // Mostramos el error en la consola para depuración
        res.status(500).json({
            ok: false,
            msg:'Hable con el administrador'
        });
    }
    
}

// Exportamos las funciones para poder utilizarlas en otros archivos
module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}