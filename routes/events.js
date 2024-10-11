/*
    Event Routes
    /api/events
*/

//* router.use(validarJWT): Todas las rutas definidas en este router requieren que el token JWT sea validado, lo que garantiza que solo los 
//*                         usuarios autenticados puedan acceder a estas rutas.
//* router.get('/'): Ruta para obtener todos los eventos. Llama al controlador getEventos que se encarga de recuperar la lista de eventos.
//* router.post('/'): Ruta para crear un nuevo evento. Valida que el título no esté vacío y que las fechas de inicio y finalización sean válidas. 
//*                   Llama al controlador crearEvento para manejar la creación del evento.
//* router.put('/'): Ruta para actualizar un evento existente. Utiliza el id del evento como parámetro para localizarlo y actualizarlo mediante 
//*                  el controlador actualizarEvento.
//* router.delete('/'): Ruta para eliminar un evento. También utiliza el id del evento como parámetro y llama al controlador eliminarEvento para manejar la eliminación.
//* Cada ruta está diseñada para manejar eventos y se asegura de que los datos sean válidos antes de realizar operaciones en la base de datos.


const { Router } = require('express');  //  Importamos el Router de Express
const { check } = require('express-validator'); // Importamos las funciones de validación

const { isDate } = require('../helpers/isDate');    // Helper para validar fechas
const { validarCampos } = require('../middlewares/validar-campos'); // Middleware para validar los campos
const { validarJWT } = require ('../middlewares/validar-jwt');  // Middleware para validar el token JWT
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events'); // Controladores para la lógica de eventos

const router= Router(); // Creamos una nueva instancia del router

// Todas las rutas deben pasar por la validación del JWT
router.use( validarJWT );


// Ruta para obtener todos los eventos
router.get('/', getEventos );

// Ruta para crear un nuevo evento
router.post(
    '/',
    [
        check('title', 'El título es obligatorio').not().isEmpty(), // Verifica que el título no esté vacío
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),  // Verifica que la fecha de inicio sea válida usando el helper isDate
        check('end', 'Fecha de finalización es obligatoria').custom( isDate ),  // Verifica que la fecha de finalización sea válida usando el helper isDate
        validarCampos   // Middleware que verifica si hay errores en las validaciones anteriores
    ],
    crearEvento // Controlador que maneja la creación del evento
);

// Ruta para actualizar un evento existente
router.put('/:id', actualizarEvento );  // Recibe el id del evento a actualizar como parámetro

// Ruta para eliminar un evento
router.delete('/:id', eliminarEvento ); // Recibe el id del evento a eliminar como parámetro

// Exportamos el router para que pueda ser utilizado en otros archivos
module.exports = router;