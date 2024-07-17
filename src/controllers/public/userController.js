// /src/controllers/userController.js

// Importa tus modelos aquí
const Usuario = require("../../../models/usuarioModel");
const ClavesTemporales = require("../../../models/clavesTemporalesModels");
const HistorialContrasenas = require("../../../models/historialContraseñas");
const UserActivityLog = require("../../../models/logsModel");
const Session = require("../../../models/sesionModel");
const Notificaciones = require("../../../models/notificacionesModel");

const axios = require("axios");
const { Op } = require("sequelize");
const twilio = require("twilio");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const accountSid = "ACe5e0045ad78466fea29886b336ebcfba";
const authToken = process.env.TOKEN_TWILIO;
const twilioClient = twilio(accountSid, authToken);
const {
  enviarCorreoValidacion,
  enviarCorreoInicioSesionExitoso,
  enviarCorreoIntentoSesionSospechoso,
  enviarCorreoCambioContraseña,
} = require("../../services/emailService");
const Sync = require("twilio/lib/rest/Sync");

module.exports = {
  getAllUsers: async (req, res, next) => {
    try {
      const users = await Usuario.findAll(); // Utilizar el método findAll del modelo User
      res.json(users);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      res.status(500).json({ error: "¡Algo salió mal al obtener usuarios!" });
    }
  },

  getSecretQuestion: async (req, res, next) => {
    const { correo } = req.body; // Usando destructuring para obtener el correo electrónico del cuerpo de la solicitud
    try {
      const user = await Usuario.findOne({ where: { correo } }); // Buscar usuario por correo
      if (user) {
        res.json({ preguntaSecreta: user.preguntaSecreta }); // Devolver solo la pregunta secreta
      } else {
        res.status(404).json({ error: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error("Error al obtener pregunta secreta:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al obtener la pregunta secreta!" });
    }
  },

  checkSecretAnswer: async (req, res, next) => {
    const { correo, respuesta } = req.body; // Obtener el correo electrónico y la respuesta secreta del cuerpo de la solicitud
    try {
      const user = await Usuario.findOne({ where: { correo } }); // Buscar usuario por correo
      if (user) {
        // Comparar la respuesta proporcionada con la respuesta secreta almacenada en la base de datos
        if (respuesta === user.respuestaPSecreta) {
          // Si las respuestas coinciden, responder con un mensaje de éxito
          res
            .status(200)
            .json({ success: true, message: "¡La respuesta es correcta!" });
        } else {
          // Si las respuestas no coinciden, responder con un mensaje de error
          res.status(400).json({
            success: false,
            error: "La respuesta proporcionada es incorrecta.",
          });
        }
      } else {
        // Si no se encuentra ningún usuario con el correo electrónico dado, responder con un mensaje de error
        res
          .status(404)
          .json({ success: false, error: "Usuario no encontrado." });
      }
    } catch (error) {
      // Manejar cualquier error que pueda ocurrir durante la consulta a la base de datos
      console.error("Error al verificar respuesta secreta:", error);
      res.status(500).json({
        success: false,
        error: "¡Algo salió mal al verificar la respuesta secreta!",
      });
    }
  },

  getUserById: async (req, res, next) => {
    const userId = req.params.id;
    try {
      const user = await Usuario.findByPk(userId); // Buscar usuario por ID
      if (user) {
        res.json(user);
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

  findPhoneByEmail: async (req, res, next) => {
    const { correo } = req.params; // Obtener el correo electrónico de los parámetros de la solicitud
    try {
      // Buscar el usuario por correo electrónico en la base de datos
      const user = await Usuario.findOne({ where: { correo } });

      if (user) {
        // Si se encuentra el usuario, devolver el número de teléfono
        res.status(200).json({ telefono: user.telefono });
      } else {
        // Si no se encuentra el usuario, devolver un mensaje de error
        res.status(404).json({ error: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error("Error al buscar teléfono por correo electrónico:", error);
      res.status(500).json({
        error: "¡Algo salió mal al buscar teléfono por correo electrónico!",
      });
    }
  },

  createUser: async (req, res, next) => {
    const userData = req.body;

    try {
      // Validar el correo electrónico usando la API de ZeroBounce
      const apiKeyZerobounce = process.env.API_KEY_ZEROBOUNCE;
      const validateEmailResponse = await axios.get(
        `https://api.zerobounce.net/v2/validate?api_key=${apiKeyZerobounce}&email=${userData.correo}`
      );

      if (validateEmailResponse.data.status === "invalid") {
        return res
          .status(400)
          .json({ error: "El correo electrónico no es válido o no existe" });
      }

      // Verificar si el correo ya está en uso
      const existingUser = await Usuario.findOne({
        where: { correo: userData.correo },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "El correo electrónico ya está en uso" });
      }

      // Validar el número de teléfono usando la API de Numverify
      const countryCode = process.env.COUNTRY_CODE; // Código de país para México
      const apiKeyNumverify = process.env.API_KEY_NUMVERIFLY;
      const validateResponse = await axios.get(
        `http://apilayer.net/api/validate?access_key=${apiKeyNumverify}&number=${userData.telefono}&country_code=${countryCode}`
      );

      if (!validateResponse.data.valid) {
        return res
          .status(400)
          .json({ error: "El número de teléfono no es válido o no existe" });
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(userData.contraseña, 10);

      const respuestaPSecreta = userData.respuestaPSecreta.trim().toLowerCase(); // Elimina espacios antes y después y convierte a minúsculas
      const respuestaPSecretaSinAcentos = respuestaPSecreta
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // Elimina acentos

      // Crear el usuario en la base de datos
      const nuevoUsuario = await Usuario.create({
        nombre: userData.nombre,
        aPaterno: userData.aPaterno,
        aMaterno: userData.aMaterno,
        correo: userData.correo,
        telefono: userData.telefono,
        sexo: userData.sexo,
        fecha_nacimiento: userData.fecha_nacimiento,
        contraseña: hashedPassword,
        preguntaSecreta: userData.preguntaSecreta,
        respuestaPSecreta: respuestaPSecretaSinAcentos,
        statusId: 1,
        intentosFallidos: 0,
        ultimoIntentoFallido: null,
        ultimoAcceso: null,
        imagen: null,
      });

      await HistorialContrasenas.create({
        usuarioId: nuevoUsuario.customerId,
        contraseña: nuevoUsuario.contraseña,
        fecha_cambio: new Date(),
      });

      await UserActivityLog.create({
        userId: nuevoUsuario.customerId,
        eventType: "Usuario creado",
        eventDetails: `Se creo el usuario ${userData.nombre} ${userData.aPaterno} (${userData.correo}).`,
        eventDate: new Date(),
        ipAddress: req.ip, // Obtener la dirección IP del cliente
        deviceType: req.headers["user-agent"], // Obtener el tipo de dispositivo desde el encabezado
        httpStatusCode: res.statusCode, // Obtiene el código de estado HTTP de la respuesta
      });

      // Responder con el nuevo usuario
      res.status(201).json(nuevoUsuario);
    } catch (error) {
      console.error("Error al crear usuario:", error);
      res.status(500).json({ error: "¡Algo salió mal al crear usuario!" });
    }
  },

  fcmToken: async (req, res) => {
    const { token, customerId } = req.body;
  
    try {
      // Actualizar el token FCM del usuario
      await Usuario.update({ fcmToken: token }, { where: { customerId: customerId } });
      res.status(200).send({ message: 'Token successfully stored' });
    } catch (error) {
      console.error('Error storing token:', error);
      res.status(500).send({ message: 'Error storing token' });
    }
  },

  loginUser: async (req, res, next) => {
    const { correo, contraseña } = req.body;

    try {
      // Buscar al usuario en la base de datos
      const user = await Usuario.findOne({ where: { correo } });

      if (!user) {
        return res.status(401).json({
          error: "El correo ingresado no está asociado a una cuenta",
        });
      }

      // Verificar si el usuario ha excedido el límite de intentos
      if (user.intentosFallidos >= 3) {
        const tiempoActual = Date.now();
        const tiempoUltimoIntento = new Date(
          user.ultimoIntentoFallido
        ).getTime();
        const tiempoTranscurrido = tiempoActual - tiempoUltimoIntento;

        // Verificar si ha transcurrido suficiente tiempo desde el último intento
        if (tiempoTranscurrido < 30000) {
          await enviarCorreoIntentoSesionSospechoso(correo); // Enviar correo de intento de inicio de sesión sospechoso
          await UserActivityLog.create({
            userId: user.customerId,
            eventType: "Bloqueo de cuenta por intentos fallidos",
            eventDetails: `Se ha exedido el numero de intentos para colocar la contraseña correctamente.`,
            eventDate: new Date(),
            ipAddress: req.ip, // Obtener la dirección IP del cliente
            deviceType: req.headers["user-agent"], // Obtener el tipo de dispositivo desde el encabezado
            httpStatusCode: res.statusCode, // Obtiene el código de estado HTTP de la respuesta
          });

          return res.status(429).json({
            error: "Se ha excedido el límite de intentos",
          });
        }
      }

      // Verificar si la contraseña es válida
      const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);

      if (!isPasswordValid) {
        // Incrementar el contador de intentos fallidos y actualizar la fecha del último intento fallido
        await user.update({
          intentosFallidos: user.intentosFallidos + 1,
          ultimoIntentoFallido: new Date(),
        });

        return res.status(401).json({ error: "Contraseña incorrecta" });
      }

      // Si las credenciales son válidas, restablecer el contador de intentos fallidos
      await user.update({ intentosFallidos: 0, ultimoAcceso: new Date() });

      await enviarCorreoInicioSesionExitoso(correo); // Enviar correo de inicio de sesión exitoso

      // Crear una nueva sesión para el usuario
      const new_sesion = await Session.create({
        userId: user.customerId,
        sessionId: uuidv4(), // Genera un sessionId único (puedes implementar esta función según tus necesidades)
        ipAddress: req.ip,
        deviceType: req.headers["user-agent"],
      });

      // Generar token JWT
      const token = jwt.sign(
        {
          customerId: user.customerId,
          nombre: user.nombre,
          aPaterno: user.aPaterno,
          aMaterno: user.aMaterno,
          sexo: user.sexo,
          correo: user.correo,
          imagen: user.imagen,
          edad: user.fecha_nacimiento,
          telefono: user.telefono,
          respuestaPSecreta: user.respuestaPSecreta,
          preguntaSecreta: user.preguntaSecreta,
          sesion: new_sesion.sessionId,
        },
        secretKey,
        {
          expiresIn: "24h", // Puedes ajustar la duración del token según tus necesidades
        }
      );

      await UserActivityLog.create({
        userId: user.customerId,
        eventType: "Inicio de sesion exitoso",
        eventDetails: `Se ha iniciado sesion exitosamente en la cuenta del usuario ${user.nombre} ${user.aPaterno} que tiene el correo asociado: ${user.correo}.`,
        eventDate: new Date(),
        ipAddress: req.ip,
        deviceType: req.headers["user-agent"],
        httpStatusCode: res.statusCode, // Obtiene el código de estado HTTP de la respuesta
      });

      // Enviar una respuesta exitosa si las credenciales son válidas
      res.status(200).json({ token, message: "Inicio de sesión exitoso" });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      res.status(500).json({ error: "¡Algo salió mal al iniciar sesión!" });
    }
  },

  logoutUser: async (req, res, next) => {
    const { sessionId } = req.body; // Se espera recibir el ID de sesión a cerrar

    try {
      // Buscar la sesión en la base de datos
      const session = await Session.findOne({ where: { sessionId } });

      if (!session) {
        return res.status(404).json({ error: "La sesión no fue encontrada" });
      }

      // Eliminar la sesión de la base de datos
      await session.destroy();

      res.status(200).json({ message: "Sesión cerrada exitosamente" });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      res.status(500).json({ error: "¡Algo salió mal al cerrar sesión!" });
    }
  },

  logoutAllUsers: async (req, res, next) => {
    const { customerId } = req.body; // Se espera recibir el ID del usuario

    try {
      // Buscar todas las sesiones asociadas al customerId
      const sessions = await Session.findAll({ where: { userId: customerId } });

      if (sessions.length === 0) {
        return res
          .status(404)
          .json({ error: "No se encontraron sesiones para el usuario" });
      }

      // Eliminar todas las sesiones encontradas
      await Session.destroy({ where: { userId: customerId } });

      res.status(200).json({
        message:
          "Todas las sesiones del usuario han sido cerradas exitosamente",
      });
    } catch (error) {
      console.error("Error al cerrar todas las sesiones del usuario:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al cerrar las sesiones!" });
    }
  },

  getSessionBySessionId: async (req, res, next) => {
    const { id } = req.params; // Suponiendo que userId viene en los parámetros de la solicitud

    try {
      // Buscar la sesión en la base de datos por userId
      const sesion = await Session.findOne({ where: { sessionId: id } });

      if (!sesion) {
        return res
          .status(404)
          .json({ error: "No se encontró ninguna sesión para el usuario" });
      }

      res.status(200).json({ sesion });
    } catch (error) {
      console.error("Error al buscar la sesión por userId:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al buscar la sesión por userId!" });
    }
  },

  verificarCorreoYEnviarClave: async (req, res, next) => {
    const { correo } = req.body;

    try {
      // Verificar si el correo existe en la base de datos
      const user = await Usuario.findOne({ where: { correo } });

      if (!user) {
        return res.status(401).json({
          error: "El correo ingresado no está asociado a una cuenta",
        });
      }

      // Generar una clave de 4 dígitos
      const clave = Math.floor(1000 + Math.random() * 9000);
      const expiracion = new Date(Date.now() + 5 * 60000); // Agrega 5 minutos en milisegundos

      const [claveTemporal, created] = await ClavesTemporales.findOrCreate({
        where: { correo },
        defaults: { clave, expiracion }, // Valores predeterminados para crear el registro si no existe
      });

      if (!created) {
        // El registro ya existía, por lo que se actualiza la clave y la expiración
        await claveTemporal.update({ clave, expiracion });
      }
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

  enviarTokenPorWhatsapp: async (req, res, next) => {
    const { correo } = req.body;

    try {
      // Verificar si el correo existe en la base de datos
      const user = await Usuario.findOne({ where: { correo } });

      if (!user) {
        return res.status(401).json({
          error: "El correo ingresado no está asociado a una cuenta",
        });
      }

      // Generar una clave de 4 dígitos
      const clave = Math.floor(1000 + Math.random() * 9000);
      const expiracion = new Date(Date.now() + 5 * 60000); // Agrega 5 minutos en milisegundos

      const [claveTemporal, created] = await ClavesTemporales.findOrCreate({
        where: { correo },
        defaults: { clave, expiracion }, // Valores predeterminados para crear el registro si no existe
      });

      if (!created) {
        // El registro ya existía, por lo que se actualiza la clave y la expiración
        await claveTemporal.update({ clave, expiracion });
      }

      // Enviar el token por WhatsApp
      await twilioClient.messages.create({
        body: `Tu token de verificación es: ${clave}, esta clave solo sera valida por 5 minutos.`,
        from: "whatsapp:+14155238886", // Número de Twilio Sandbox de WhatsApp
        to: `whatsapp:+521${user.telefono}`, // Agrega el código de país al número de teléfono
      });

      res.status(200).json({
        message: "Token de verificación enviado por WhatsApp",
      });
    } catch (error) {
      console.error("Error al enviar token por WhatsApp:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al enviar token por WhatsApp!" });
    }
  },

  compararClave: async (req, res, next) => {
    const { correo, clave } = req.body;
    try {
      // Consultar la clave temporal asociada al correo en la base de datos
      const claveTemporal = await ClavesTemporales.findOne({
        where: { correo },
      });

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
        if (new Date() <= claveTemporal.expiracion) {
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
      // Buscar al usuario en la base de datos
      const user = await Usuario.findOne({ where: { correo } });

      // Verificar si se encontró al usuario
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "Usuario no encontrado" });
      }

      // Verificar si la nueva contraseña es igual a la actual
      const isSamePassword = await bcrypt.compare(
        nuevaContraseña,
        user.contraseña
      );
      if (isSamePassword) {
        return res.status(400).json({
          success: false,
          error: "La nueva contraseña debe ser diferente de la actual",
        });
      }

      // Obtener todas las contraseñas anteriores del usuario
      const historialContraseñas = await HistorialContrasenas.findAll({
        where: { usuarioId: user.customerId },
        order: [["fecha_cambio", "DESC"]], // Ordenar por fecha de cambio en orden descendente
      });

      // Comparar la nueva contraseña con todas las contraseñas anteriores
      for (const historial of historialContraseñas) {
        const isSameAsPreviousPassword = await bcrypt.compare(
          nuevaContraseña,
          historial.contraseña
        );
        if (isSameAsPreviousPassword) {
          const fechaCambio = historial.fecha_cambio;
          return res.status(400).json({
            success: false,
            error: `La nueva contraseña ya fue usada anteriormente el ${fechaCambio}`,
          });
        }
      }

      // Encriptar la nueva contraseña
      const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

      // Actualizar la contraseña en la base de datos
      await user.update({ contraseña: hashedPassword });

      // Agregar la nueva contraseña al historial de contraseñas
      await HistorialContrasenas.create({
        usuarioId: user.customerId,
        contraseña: hashedPassword,
        fecha_cambio: new Date(),
      });

      // Enviar correo electrónico de cambio de contraseña
      await enviarCorreoCambioContraseña(correo);

      // Registrar la actividad del usuario
      await UserActivityLog.create({
        userId: user.customerId,
        eventType: "Cambio de contraseña",
        eventDetails: `Se cambió la contraseña del usuario ${user.nombre} ${user.aPaterno} (${user.correo}).`,
        eventDate: new Date(),
        ipAddress: req.ip, // Obtener la dirección IP del cliente
        deviceType: req.headers["user-agent"], // Obtener el tipo de dispositivo desde el encabezado
        httpStatusCode: res.statusCode, // Obtiene el código de estado HTTP de la respuesta
      });

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

  updateSecretQuestionAndAnswer: async (req, res, next) => {
    const { customerId } = req.params;
    const { preguntaSecreta, respuestaPSecreta } = req.body;

    try {
      // Buscar al usuario en la base de datos
      const user = await Usuario.findByPk(customerId);

      // Verificar si se encontró al usuario
      if (!user) {
        return res.status(404).json({ success: false, error: "Usuario no encontrado" });
      }

      // Actualizar la pregunta y respuesta secreta del usuario
      await user.update({ preguntaSecreta, respuestaPSecreta });

      // Responder con un mensaje de éxito
      res.status(200).json({ success: true, message: "Pregunta y respuesta secretas actualizadas exitosamente" });
    } catch (error) {
      console.error("Error al actualizar pregunta y respuesta secreta:", error);
      res.status(500).json({ success: false, error: "¡Algo salió mal al actualizar pregunta y respuesta secreta!" });
    }
  },

  getAllNotifications: async (req, res, next) => {
    const customerId = req.params.customerId;
    try {
      const notificaciones = await Notificaciones.findAll({
        where: {
          customerId // Filtrar por customerId
        }
      });
      res.json(notificaciones);
    } catch (error) {
      console.error("Error al obtener todas las notificaciones:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al obtener todas las notificaciones!" });
    }
  },

  actualizarEstadoNotificacion: async (req, res) => {
    const notificationId = req.params.notificationId;
  
    try {
      // Buscar la notificación por su id
      const notificacion = await Notificaciones.findByPk(notificationId);
  
      // Verificar si la notificación existe
      if (!notificacion) {
        return res.status(404).json({ message: 'Notificación no encontrada' });
      }
  
      // Actualizar el estado de la notificación
      await notificacion.update({ estado: 'Leido' }); // Cambiar 'leido' por el estado deseado
  
      return res.status(200).json({ message: 'Estado de notificación actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar estado de notificación:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  searchUsersAdvance : async (req, res, next) => {
    const { correo, statusId } = req.body;
  
    try {
      // Crear el objeto de condiciones
      const conditions = {};
  
      // Convertir las cadenas de búsqueda a minúsculas para hacer la búsqueda insensible a mayúsculas y minúsculas
      if (correo) {
        conditions.correo = { [Op.like]: `%${correo.toLowerCase()}%` };
      }
      if (statusId) {
        conditions.statusId = statusId;
      }
  
      // Realizar la búsqueda de usuarios con las condiciones construidas
      const users = await Usuario.findAll({
        where: conditions,
      });
  
      // Responder con los usuarios encontrados
      res.json(users);
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      res.status(500).json({ error: "¡Algo salió mal al buscar usuarios!" });
    }
  }

};
