const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth:{
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASSWORD
  }
})

async function enviarMailVerificacion(direccion,token){
  return await transporter.sendMail({
    from:"EHAppCalendar 😀 <no-reply EHAppCalendar@gmail.com>",
    to:direccion,
    subject:"Verificacion de Cuenta EHAppCalendar",
    html: crearMailVerificacion(token)
  })
}

function crearMailVerificacion(token){
  return `
  <!DOCTYPE html>
  <html lang="es">
    <style>
      html{
        background-color: white;
      }
      body{
        max-width: 600px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: auto;
        background-color: rgb(229, 255, 246);
        padding: 40px;
        border-radius: 4px;
        margin-top: 10px;
      }
    </style>
  <body>
    <h1>Verificación de correo electrónico - EHAppCalendar.lat</h1>
    <p>Se ha creado una cuenta en EHAppCalendar.lat con este correo electrónico.</p>
      <p>Nos da mucho gusto tenerte con nosotros.</p>
      <p><strong>¡Saludos!</strong></p>
  </body>
  </html>
  `
}

module.exports = {
    enviarMailVerificacion
}