//* Este código configura un servidor básico usando Express. Incluye la conexión a una base de datos, habilitación de CORS, 
//* definición de rutas para autenticación y eventos, y la escucha de peticiones en un puerto especificado. También configura 
//* el servidor para servir contenido estático y procesar datos JSON en el cuerpo de las solicitudes.


// Importamos express, dotenv para variables de entorno, cors y la conexión a la base de datos
const path = require('path');
const express = require('express');
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env
const cors = require('cors');
const { dbConnection } = require('./database/config');  // Importa la función para conectar a la base de datos


// Crear el servidor de express
const app = express();

// Base de datos: Conectamos a la base de datos utilizando la función dbConnection
dbConnection();

// CORS: Habilita el uso para permitir solicitudes de diferentes dominios
app.use(cors());

// Directorio Público: Sirve el contenido estático desde la carpeta 'public'
app.use( express.static('public') );

// Lectura y parseo del body: Convierte el cuerpo de las peticiones a formato JSON automáticamente
app.use( express.json() );

// Rutas: Define las rutas para autenticación y eventos
app.use('/api/auth', require('./routes/auth') );    // Rutas para autenticación: crear usuario, login, renovar token
app.use('/api/events', require('./routes/events') );    // Rutas CRUD (Crear, Leer, Actualizar, Eliminar) para eventos

// Redirección al login
app.use('*', ( req, res ) => {
    res.sendFile( path.join( __dirname, 'public/index.html' ) );
});

// Escuchar peticiones: El servidor escucha las peticiones en el puerto especificado en las variables de entorno
app.listen( process.env.PORT, () =>{
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
});