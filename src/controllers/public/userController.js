// /src/controllers/userController.js

const db = require("../../config/database");
const Yup = require("yup");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const email = process.env.USER_EMAIL;
const pass = process.env.PASS_EMAIL;
// const enviarCorreoValidacion = require("../../services/emailService");
const nodemailer = require("nodemailer");

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

const validationSchema = Yup.object().shape({
  nombre: Yup.string()
    .matches(
      /^[a-zA-ZáéíóúñÑÁÉÍÓÚüÜ\s]+$/,
      "El nombre solo puede contener letras, acentos y espacios"
    )
    .min(3, "El nombre debe tener al menos 10 caracteres")
    .max(20, "El nombre no puede tener más de 50 caracteres")
    .required("El nombre es obligatorio"),
  aPaterno: Yup.string()
    .matches(
      /^[a-zA-ZáéíóúñÑÁÉÍÓÚüÜ\s]+$/,
      "El nombre solo puede contener letras, acentos y espacios"
    )
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(15, "El nombre no puede tener más de 15 caracteres")
    .required("El nombre es obligatorio"),
  aMaterno: Yup.string()
    .matches(
      /^[a-zA-ZáéíóúñÑÁÉÍÓÚüÜ\s]+$/,
      "El nombre solo puede contener letras, acentos y espacios"
    )
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(15, "El nombre no puede tener más de 15 caracteres")
    .required("El nombre es obligatorio"),
  correo: Yup.string()
    .email("Correo electrónico inválido")
    .required("Email es obligatorio")
    .matches(
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
      "Ingresa una dirección de correo electrónico válida"
    ),
  telefono: Yup.string()
    .required("Telefono requerido")
    .matches(/^\d+$/, "El teléfono debe contener solo números")
    .min(10, "El Telefono debe tener al menos 10 digitos"),
  sexo: Yup.string().required("Seleccione su sexo"),
  fecha_nacimiento: Yup.date()
    .max(new Date(), "La fecha de nacimiento no puede ser en el futuro")
    .required("Campo obligatorio"),
  contraseña: Yup.string()
    .min(8, "La contraseña debe tener al menos 6 caracteres")
    .required("Contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/\d{1,2}/, "Debe contener al menos 1 o 2 dígitos")
    .matches(/[A-Z]{1,2}/, "Debe contener al menos 1 o 2 letras mayúsculas")
    .matches(/[a-z]{1,2}/, "Debe contener al menos 1 o 2 letras minúsculas")
    .matches(
      /[^A-Za-z0-9]{1,2}/,
      "Debe contener al menos 1 o 2 caracteres especiales"
    )
    .required("Contraseña es obligatoria"),
});

// Esquema de validación específico para el inicio de sesión
const loginValidationSchema = Yup.object().shape({
  correo: Yup.string()
    .email("Correo electrónico inválido")
    .required("Email es obligatorio")
    .matches(
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
      "Ingresa una dirección de correo electrónico válida"
    ),
  contraseña: Yup.string()
    .min(8, "La contraseña debe tener al menos 6 caracteres")
    .required("Contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/\d{1,2}/, "Debe contener al menos 1 o 2 dígitos")
    .matches(/[A-Z]{1,2}/, "Debe contener al menos 1 o 2 letras mayúsculas")
    .matches(/[a-z]{1,2}/, "Debe contener al menos 1 o 2 letras minúsculas")
    .matches(
      /[^A-Za-z0-9]{1,2}/,
      "Debe contener al menos 1 o 2 caracteres especiales"
    )
    .required("Contraseña es obligatoria"),
});

module.exports = {
  getAllUsers: async (req, res, next) => {
    try {
      const users = await db.query("CALL sp_consultar_usuarios();");
      res.json(users);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      res.status(500).json({ error: "¡Algo salió mal al obtener usuarios!" });
    }
  },

  getUserById: async (req, res, next) => {
    const userId = req.params.id;
    try {
      const user = await db.query(
        "SELECT * FROM usuarios WHERE customerId = ?",
        [userId]
      );
      if (user.length > 0) {
        res.json(user[0]);
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error("Error al obtener usuario por ID:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al obtener usuario por ID!" });
    }
  },

  createUser: async (req, res, next) => {
    const userData = req.body;

    try {
      // Validar los datos usando Yup
      await validationSchema.validate(userData, { abortEarly: false });

      // Verificar si el correo ya está en uso
      const existingUser = await db.query(
        "SELECT * FROM usuarios WHERE correo = ?",
        [userData.correo]
      );

      if (existingUser.length > 0) {
        return res
          .status(400)
          .json({ error: "El correo electrónico ya está en uso" });
      }

      // Generar un id único
      const userId = uuidv4();

      // Convertir fecha_nacimiento a un objeto de fecha
      userData.fecha_nacimiento = new Date(userData.fecha_nacimiento);

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(userData.contraseña, 10);

      // Insertar el nuevo usuario en la base de datos con la contraseña encriptada
      const result = await db.query(
        "INSERT INTO usuarios (customerId, nombre, aPaterno, aMaterno, correo, telefono, sexo, fecha_nacimiento, contraseña, ultimoAcceso, statusId, created, modified, intentosFallidos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, null, 1, NOW(), NOW(), 0)",
        [
          userId,
          userData.nombre,
          userData.aPaterno,
          userData.aMaterno,
          userData.correo,
          userData.telefono,
          userData.sexo,
          userData.fecha_nacimiento,
          hashedPassword,
        ]
      );

      // Obtener el usuario recién creado
      const nuevoUsuario = await db.query(
        "SELECT * FROM usuarios WHERE customerId = ?",
        [userId]
      );

      // Responder con el nuevo usuario
      res.status(201).json(nuevoUsuario[0]);
    } catch (error) {
      // Manejar errores de validación
      if (error.name === "ValidationError") {
        const errors = error.errors.map((err) => err.message);
        return res.status(400).json({ errors });
      }

      console.error("Error al crear usuario:", error);
      res.status(500).json({ error: "¡Algo salió mal al crear usuario!" });
    }
  },

  loginUser: async (req, res, next) => {
    const { correo, contraseña } = req.body;

    try {
      // Lógica para rastrear los intentos de inicio de sesión fallidos
      const user = await db.query("SELECT * FROM usuarios WHERE correo = ?", [
        correo,
      ]);

      if (user.length === 0) {
        return res.status(401).json({
          error: "El correo ingresado no esta asociado a una cuenta",
        });
      }

      // Verificar si el usuario ha excedido el límite de intentos
      if (user[0].intentosFallidos >= 3) {
        const tiempoActual = Date.now();
        const tiempoUltimoIntento = new Date(
          user[0].ultimoIntentoFallido
        ).getTime();
        const tiempoTranscurrido = tiempoActual - tiempoUltimoIntento;

        // Verificar si ha transcurrido suficiente tiempo desde el último intento
        if (tiempoTranscurrido < 30000) {
          await enviarCorreoIntentoSesionSospechoso(correo); // Enviar correo de intento de inicio de sesión sospechoso

          return res.status(429).json({
            error: "Se ha excedido el límite de intentos de inicio de sesion",
          });
        }
      }

      // Verificar la contraseña
      const isPasswordValid = await bcrypt.compare(
        contraseña,
        user[0].contraseña
      );

      if (!isPasswordValid) {
        // Incrementar el contador de intentos fallidos
        await db.query(
          "UPDATE usuarios SET intentosFallidos = intentosFallidos + 1, ultimoIntentoFallido = NOW() WHERE correo = ?",
          [correo]
        );
        return res.status(401).json({ error: "Contraseña incorrecta" });
      }

      // Si las credenciales son válidas, restablecer el contador de intentos fallidos
      await db.query(
        "UPDATE usuarios SET intentosFallidos = 0, ultimoAcceso = NOW() WHERE correo = ?",
        [correo]
      );

      await enviarCorreoInicioSesionExitoso(correo); // Enviar correo de inicio de sesión exitoso

      // Resto del código para generar el token JWT y enviar una respuesta exitosa
      // Generar token JWT
      const token = jwt.sign(
        {
          customerId: user[0].customerId,
          nombre: user[0].nombre,
          aPaterno: user[0].aPaterno,
          aMaterno: user[0].aMaterno,
        },
        secretKey,
        {
          expiresIn: "10s", // Puedes ajustar la duración del token según tus necesidades
        }
      );

      // Enviar una respuesta exitosa si las credenciales son válidas
      res.status(200).json({ token, message: "Inicio de sesión exitoso" });
    } catch (error) {
      // Manejar errores
      if (error.name === "ValidationError") {
        const errors = error.errors.map((err) => err.message);
        return res.status(400).json({ errors });
      }

      console.error("Error al iniciar sesión:", error);
      res.status(500).json({ error: "¡Algo salió mal al iniciar sesión!" });
    }
  },

  verificarCorreoYEnviarClave: async (req, res, next) => {
    const { correo } = req.body;

    try {
      // Verificar si el correo existe en la base de datos
      const user = await db.query("SELECT * FROM usuarios WHERE correo = ?", [
        correo,
      ]);

      if (user.length === 0) {
        return res.status(401).json({
          error: "El correo ingresado no está asociado a una cuenta",
        });
      }

      // Generar una clave de 4 dígitos
      const clave = Math.floor(1000 + Math.random() * 9000);
      const fechaActual = new Date();
      const expiracion = new Date(fechaActual.getTime() + 5 * 60000); // Agrega 5 minutos en milisegundos

      // Verificar si el correo existe en la base de datos
      await db.query(
        "UPDATE claves_temporales SET clave = ?, expiracion = ? WHERE correo = ?",
        [clave, expiracion, correo]
      );

      // Enviar la clave por correo electrónico
      await enviarCorreoValidacion(correo, clave.toString());

      res.status(200).json({
        message: "Clave de validación enviada por correo electrónico",
      });
    } catch (error) {
      console.error("Error al verificar correo y enviar clave:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al verificar correo y enviar clave!" });
    }
  },

  compararClave: async (req, res, next) => {
    const { correo, clave } = req.body;
    try {
      // Consultar la clave temporal asociada al correo en la base de datos
      const result = await db.query(
        "SELECT * FROM claves_temporales WHERE correo = ?",
        [correo]
      );
      const claveTemporal = result[0];

      // Verificar si se encontró la clave temporal en la base de datos
      if (!claveTemporal) {
        return res.status(404).json({
          success: false,
          message:
            "No se encontró una clave temporal asociada al correo proporcionado",
        });
      }

      // Verificar si la clave recibida coincide con la clave almacenada
      if (clave === claveTemporal.clave) {
        // Verificar si la clave ha expirado
        if (new Date() <= new Date(claveTemporal.expiracion)) {
          // La clave es válida y no ha expirado
          return res
            .status(200)
            .json({ success: true, message: "Clave verificada con éxito" });
        } else {
          // La clave ha expirado
          return res
            .status(400)
            .json({ success: false, message: "La clave ha expirado" });
        }
      } else {
        // La clave no coincide
        return res
          .status(400)
          .json({ success: false, message: "La clave no coincide" });
      }
    } catch (error) {
      console.error("Error al comparar claves:", error);
      return res
        .status(500)
        .json({ success: false, error: "Error al comparar claves" });
    }
  },

  cambiarContraseña: async (req, res, next) => {
    const { correo, nuevaContraseña } = req.body;
  
    try {
      // Consultar la contraseña actual del usuario
      const user = await db.query(
        "SELECT customerId, contraseña FROM usuarios WHERE correo = ?",
        [correo]
      );
  
      // Verificar si se encontró al usuario
      if (user.length === 0) {
        return res.status(404).json({ success: false, error: "Usuario no encontrado" });
      }
  
      // Verificar si la nueva contraseña es igual a la actual
      const isSamePassword = await bcrypt.compare(nuevaContraseña, user[0].contraseña);
      if (isSamePassword) {
        return res.status(400).json({
          success: false,
          error: "La nueva contraseña debe ser diferente de la actual",
        });
      }
  
      // Consultar el historial de contraseñas del usuario
const passwordHistory = await db.query(
  "SELECT contraseña, fecha_cambio FROM historial_contraseñas WHERE usuarioId = ?",
  [user[0].customerId]
);

// Verificar si la nueva contraseña ya se ha utilizado anteriormente
const usedPasswordEntry = passwordHistory.find((historial) => {
  return bcrypt.compareSync(nuevaContraseña, historial.contraseña);
});

if (usedPasswordEntry) {
  // Obtener la fecha de cambio del historial de contraseñas
  const lastChangeDate = new Date(usedPasswordEntry.fecha_cambio);
  
  // Verificar si la fecha es válida
  if (!isNaN(lastChangeDate)) {
    // Formatear la fecha en el formato deseado
    const formattedLastChangeDate = `${lastChangeDate.getDate()}/${lastChangeDate.getMonth() + 1}/${lastChangeDate.getFullYear()}`;
  
    return res.status(400).json({
      success: false,
      error: `La nueva contraseña no puede ser utilizada porque ya se ha utilizado anteriormente. La contraseña se utilizó por última vez el ${formattedLastChangeDate}`,
    });
  } else {
    // En caso de que la fecha no sea válida, proporcionar un mensaje genérico
    return res.status(400).json({
      success: false,
      error: `La nueva contraseña no puede ser utilizada porque ya se ha utilizado anteriormente. No se pudo obtener la fecha de cambio.`,
    });
  }
}


      // Encriptar la nueva contraseña
      const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);
  
      // Actualizar la contraseña en la base de datos
      await db.query("UPDATE usuarios SET contraseña = ? WHERE correo = ?", [
        hashedPassword,
        correo,
      ]);
  
      // Agregar la nueva contraseña al historial de contraseñas
      await db.query(
        "INSERT INTO historial_contraseñas (usuarioId, contraseña, fecha_cambio) VALUES (?, ?, NOW())",
        [user[0].customerId, hashedPassword]
      );
  
      // Enviar correo electrónico de cambio de contraseña
      await enviarCorreoCambioContraseña(correo); // Función para enviar el correo electrónico
  
      // Responder con un mensaje de éxito
      res.status(200).json({
        success: true,
        message: "Contraseña actualizada exitosamente",
      });
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      res.status(500).json({
        success: false,
        error: "¡Algo salió mal al cambiar la contraseña!",
      });
    }
  },
  
};
