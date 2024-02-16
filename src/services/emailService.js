const nodemailer = require("nodemailer");

const enviarCorreoValidacion = async (correo, clave) => {
    try {
      // Configurar el servicio de correo electrónico
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: email, // Cambiar por tu dirección de correo electrónico
          pass: pass, // Cambiar por tu contraseña
        },
      });

      // Configurar el mensaje de correo electrónico en formato HTML
      const mensaje = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Clave de verificación</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f8f9fa;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .logo {
                  max-width: 150px;
                  margin-bottom: 20px;
              }
              .message {
                  font-size: 16px;
                  color: #333333;
                  margin-bottom: 20px;
              }
              .cta {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007bff;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 5px;
              }
              .disclaimer {
                  font-size: 12px;
                  color: #777777;
                  margin-top: 20px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <img class="logo" src="https://tu_empresa.com/logo.png" alt="Logo de la empresa">
              <h2>¡Hola!</h2>
              <p class="message">Has solicitado una clave de verificación para tu cuenta. Esta clave es necesaria para completar el proceso de verificación y acceder a todas las funciones de nuestra plataforma de forma segura.</p>
              <p class="message">Tu clave de verificación es: <strong>${clave}</strong>. Por favor, ingrésala en nuestra plataforma para continuar.</p>
              <a class="cta" href="#">Verificar ahora</a>
              <p class="disclaimer">Si no solicitaste esta clave, puedes ignorar este mensaje. Tu cuenta seguirá siendo segura.</p>
          </div>
      </body>
      </html>
      
      `;

      // Configurar el mensaje de correo electrónico
      const mailOptions = {
        from: email, // Cambiar por tu dirección de correo electrónico
        to: correo,
        subject: "Clave de validación",
        html: mensaje,
      };

      // Enviar el correo electrónico
      await transporter.sendMail(mailOptions);
      console.log("Correo electrónico enviado con éxito");
    } catch (error) {
      console.error("Error al enviar correo electrónico:", error);
      throw new Error("Error al enviar correo electrónico");
    }
};

module.exports = enviarCorreoValidacion;
