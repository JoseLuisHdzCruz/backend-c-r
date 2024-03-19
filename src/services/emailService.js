const nodemailer = require("nodemailer");
const email = process.env.USER_EMAIL;
const pass = process.env.PASS_EMAIL;

// Funcion para enviar correo electronico con clave de verificacion
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
                .container-img{
                    display: flex;
                    justify-content: center;
                    align-items: center;
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
                    color: #ffff;
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
                <div class="container-img">
                  <img class="logo" src="https://res.cloudinary.com/drvcma1kk/image/upload/v1708095176/Chucherias_voeuno.png" alt="Logo de la empresa">
                </div>
                <h2>¡Hola!</h2>
                <p class="message">Has solicitado una clave de verificación para tu cuenta. Esta clave es necesaria para completar el proceso de verificación y acceder a todas las funciones de nuestra plataforma de forma segura.</p>
                <p class="message">Tu clave de verificación es: <strong>${clave}</strong>. Por favor, ingrésala en nuestra plataforma para continuar.</p>
                <a class="cta" href="https://chucherias-y-regalos.vercel.app/key-verification/${correo}">Verificar ahora</a>
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

// Función para enviar correo electrónico de inicio de sesión exitoso
const enviarCorreoInicioSesionExitoso = async (correo) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass: pass,
      },
    });

    const mensaje = `
          <!DOCTYPE html>
          <html lang="es">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Inicio de sesión exitoso</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f8f9fa;
                      margin: 0;
                      padding: 0;
                  }
                  h2, p {
                      margin-bottom: 20px;
                  }
                  .container-img{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .logo {
                  max-width: 150px;
                  margin-bottom: 20px;
              }
              </style>
          </head>
          <body>
              <div class="container">
              <div class="container-img">
                  <img class="logo" src="https://res.cloudinary.com/drvcma1kk/image/upload/v1708095176/Chucherias_voeuno.png" alt="Logo de la empresa">
                </div>
                  <h2>¡Hola!</h2>
                  <p>Has iniciado sesión exitosamente en nuestro sistema.</p>
                  <p>Fecha y hora de inicio de sesión: ${new Date().toLocaleString()}</p>
              </div>
          </body>
          </html>
          `;

    const mailOptions = {
      from: email,
      to: correo,
      subject: "Inicio de sesión exitoso",
      html: mensaje,
    };

    await transporter.sendMail(mailOptions);
    console.log(
      "Correo electrónico de inicio de sesión exitoso enviado con éxito"
    );
  } catch (error) {
    console.error(
      "Error al enviar correo electrónico de inicio de sesión exitoso:",
      error
    );
    throw new Error(
      "Error al enviar correo electrónico de inicio de sesión exitoso"
    );
  }
};

// Función para enviar correo electrónico de intento de inicio de sesión sospechoso
const enviarCorreoIntentoSesionSospechoso = async (correo) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass: pass,
      },
    });

    const mensaje = `
          <!DOCTYPE html>
          <html lang="es">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Intento de inicio de sesión sospechoso</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f8f9fa;
                      margin: 0;
                      padding: 0;
                  }
                  .container-img{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                  .container {
                      max-width: 600px;
                      margin: 20px auto;
                      padding: 20px;
                      background-color: #ffffff;
                      border-radius: 10px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  h2, p {
                      margin-bottom: 20px;
                  }
                  .logo {
                    max-width: 150px;
                    margin-bottom: 20px;
                }
              </style>
          </head>
          <body>
              <div class="container">
              <div class="container-img">
                  <img class="logo" src="https://res.cloudinary.com/drvcma1kk/image/upload/v1708095176/Chucherias_voeuno.png" alt="Logo de la empresa">
                </div>
                  <h2>¡Alerta!</h2>
                  <p>Se ha detectado un intento de inicio de sesión sospechoso en tu cuenta.</p>
                  <p>Fecha y hora del intento: ${new Date().toLocaleString()}</p>
              </div>
          </body>
          </html>
          `;

    const mailOptions = {
      from: email,
      to: correo,
      subject: "Intento de inicio de sesión sospechoso",
      html: mensaje,
    };

    await transporter.sendMail(mailOptions);
    console.log(
      "Correo electrónico de intento de inicio de sesión sospechoso enviado con éxito"
    );
  } catch (error) {
    console.error(
      "Error al enviar correo electrónico de intento de inicio de sesión sospechoso:",
      error
    );
    throw new Error(
      "Error al enviar correo electrónico de intento de inicio de sesión sospechoso"
    );
  }
};

const enviarCorreoCambioContraseña = async (correo) => {
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
                  <title>Notificación de cambio de contraseña</title>
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
                      .container-img{
                        display: flex;
                        justify-content: center;
                        align-items: center;
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
                      .disclaimer {
                          font-size: 12px;
                          color: #777777;
                          margin-top: 20px;
                      }
                  </style>
              </head>
              <body>
                  <div class="container">
                  <div class="container-img">
                  <img class="logo" src="https://res.cloudinary.com/drvcma1kk/image/upload/v1708095176/Chucherias_voeuno.png" alt="Logo de la empresa">
                </div>
                      <h2>¡Hola!</h2>
                      <p class="message">Se ha realizado un cambio de contraseña en tu cuenta.</p>
                      <p class="message">Fecha y hora del cambio: <strong>${new Date().toLocaleString()}</strong></p>
                      <p class="disclaimer">Si no reconoces este cambio, por favor contáctanos de inmediato.</p>
                  </div>
              </body>
              </html>
          `;

    // Configurar el mensaje de correo electrónico
    const mailOptions = {
      from: email, // Cambiar por tu dirección de correo electrónico
      to: correo,
      subject: "Notificación de cambio de contraseña",
      html: mensaje,
    };

    // Enviar el correo electrónico
    await transporter.sendMail(mailOptions);
    console.log("Correo electrónico de cambio de contraseña enviado con éxito");
  } catch (error) {
    console.error(
      "Error al enviar correo electrónico de cambio de contraseña:",
      error
    );
    throw new Error(
      "Error al enviar correo electrónico de cambio de contraseña"
    );
  }
};

module.exports = {
  enviarCorreoValidacion,
  enviarCorreoInicioSesionExitoso,
  enviarCorreoIntentoSesionSospechoso,
  enviarCorreoCambioContraseña
};
