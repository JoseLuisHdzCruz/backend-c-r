// /src/controllers/userController.js

const db = require("../../config/database");
const Yup = require("yup");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const { 
  enviarCorreoValidacion, 
  enviarCorreoInicioSesionExitoso, 
  enviarCorreoIntentoSesionSospechoso, 
  enviarCorreoCambioContraseña 
} = require("../../services/emailService");


const validationSchema = Yup.object().shape({
  nombre: Yup.string()
    .matches(
      /^[a-zA-ZáéíóúñÑÁÉÍÓÚüÜ\s]+$/,
      "El nombre solo puede contener letras, acentos y espacios"
    )
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(20, "El nombre no puede tener más de 20 caracteres")
    .required("El nombre es obligatorio")
    .test(
      "no-repetir-caracteres",
      "El nombre no puede contener caracteres repetidos consecutivos más de 2 veces",
      (value) => {
        // Verificar que no haya más de 2 caracteres repetidos consecutivos
        const regex = /([a-zA-ZáéíóúñÑÁÉÍÓÚüÜ])\1{2,}/g;
        return !regex.test(value);
      }
    ),
  aPaterno: Yup.string()
    .matches(
      /^[a-zA-ZáéíóúñÑÁÉÍÓÚüÜ\s]+$/,
      "El nombre solo puede contener letras, acentos y espacios"
    )
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(15, "El nombre no puede tener más de 15 caracteres")
    .required("El nombre es obligatorio")
    .test(
      "no-repetir-caracteres",
      "El nombre no puede contener caracteres repetidos consecutivos más de 2 veces",
      (value) => {
        // Verificar que no haya más de 2 caracteres repetidos consecutivos
        const regex = /([a-zA-ZáéíóúñÑÁÉÍÓÚüÜ])\1{2,}/g;
        return !regex.test(value);
      }
    ),
  aMaterno: Yup.string()
    .matches(
      /^[a-zA-ZáéíóúñÑÁÉÍÓÚüÜ\s]+$/,
      "El nombre solo puede contener letras, acentos y espacios"
    )
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(15, "El nombre no puede tener más de 15 caracteres")
    .required("El nombre es obligatorio")
    .test(
      "no-repetir-caracteres",
      "El nombre no puede contener caracteres repetidos consecutivos más de 2 veces",
      (value) => {
        // Verificar que no haya más de 2 caracteres repetidos consecutivos
        const regex = /([a-zA-ZáéíóúñÑÁÉÍÓÚüÜ])\1{2,}/g;
        return !regex.test(value);
      }
    ),
  correo: Yup.string()
    .email("Correo electrónico inválido")
    .required("Email es obligatorio")
    .matches(
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
      "Ingresa una dirección de correo electrónico válida"
    ),
  telefono: Yup.number()
    .typeError("Formato invalido")
    .required("Telefono requerido")
    .min(10, "El Telefono debe tener al menos 10 digitos"),
  sexo: Yup.string().required("Seleccione su sexo"),
  preguntaSecreta: Yup.string().required("Seleccione su pregunta"),
  respuestaSecreta: Yup.string()
    .matches(
      /^[a-zA-ZáéíóúñÑÁÉÍÓÚüÜ\s]+$/,
      "El nombre solo puede contener letras, acentos y espacios"
    )
    .min(3, "La respuesta debe tener al menos 3 caracteres")
    .max(50, "La respuesta no puede tener más de 50 caracteres")
    .required("La respuesta es obligatorio"),
  fecha_nacimiento: Yup.date()
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      "Debes ser mayor de 18 años"
    )
    .required("Fecha de nacimiento es obligatoria"),
  contraseña: Yup.string()
    .required("Contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/\d{1,2}/, "Debe contener al menos 1 o 2 dígitos")
    .matches(/[A-Z]{1,2}/, "Debe contener al menos 1 o 2 letras mayúsculas")
    .matches(/[a-z]{1,2}/, "Debe contener al menos 1 o 2 letras minúsculas")
    .matches(
      /[^A-Za-z0-9]{1,2}/,
      "Debe contener al menos 1 o 2 caracteres especiales"
    ),
  RContraseña: Yup.string()
    .required("Campo obligatorio")
    .oneOf([Yup.ref("contraseña"), null], "Las contraseñas deben coincidir"),
  aceptaTerminos: Yup.boolean().oneOf(
    [true],
    "Debes aceptar los términos y condiciones para registrarte"
  ),
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

  getSecretQuestion: async (req, res, next) => {
    const { correo } = req.body; // Usando destructuring para obtener el correo electrónico del cuerpo de la solicitud
    try {
      const users = await db.query(
        "SELECT preguntaSecreta FROM usuarios WHERE correo = ?",
        [correo]
      );
      if (users.length > 0) {
        res.json(users[0].preguntaSecreta); // Devolver solo la pregunta secreta, no todo el usuario
      } else {
        res.status(404).json({ error: "Usuario no encontrado" }); // Manejar el caso en que el usuario no se encuentre
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
      // Consultar la respuesta secreta almacenada en la base de datos para el usuario con el correo electrónico dado
      const user = await db.query(
        "SELECT respuestaPSecreta FROM usuarios WHERE correo = ?",
        [correo]
      );
      if (user.length > 0) {
        const respuestaSecretaDB = user[0].respuestaPSecreta; // Obtener la respuesta secreta almacenada en la base de datos
        // Comparar la respuesta proporcionada con la respuesta secreta almacenada en la base de datos
        if (respuesta === respuestaSecretaDB) {
          // Si las respuestas coinciden, responder con un mensaje de éxito
          res
            .status(200)
            .json({ success: true, message: "¡La respuesta es correcta!" });
        } else {
          // Si las respuestas no coinciden, responder con un mensaje de error
          res
            .status(400)
            .json({
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
      res
        .status(500)
        .json({
          success: false,
          error: "¡Algo salió mal al verificar la respuesta secreta!",
        });
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

      // Validar el número de teléfono usando la API de apilayer
      const apiKeyZerobounce = process.env.API_KEY_ZEROBOUNCE;
      const validateEmailResponse = await axios.get(
        `https://api.zerobounce.net/v2/validate?api_key=${apiKeyZerobounce}&email=${userData.correo}`
      );

      if (validateEmailResponse.data.status === "invalid") {
        return res
          .status(400)
          .json({ error: "El correo electronico no es válido o no existe" });
      }

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

      // Validar el número de teléfono usando la API de apilayer
      const countryCode = process.env.COUNTRY_CODE; // Código de país para México
      const apiKey = process.env.API_KEY_NUMVERIFLY;
      const validateResponse = await axios.get(
        `http://apilayer.net/api/validate?access_key=${apiKey}&number=${userData.telefono}&country_code=${countryCode}`
      );

      if (!validateResponse.data.valid) {
        return res
          .status(400)
          .json({ error: "El número de teléfono no es válido o no existe" });
      }

      // Generar un id único
      const userId = uuidv4();

      // Convertir fecha_nacimiento a un objeto de fecha
      userData.fecha_nacimiento = new Date(userData.fecha_nacimiento);

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(userData.contraseña, 10);

      // Insertar el nuevo usuario en la base de datos con la contraseña encriptada
      const result = await db.query(
        "INSERT INTO usuarios (customerId, nombre, aPaterno, aMaterno, correo, telefono, sexo, fecha_nacimiento, contraseña, ultimoAcceso, statusId, created, modified, intentosFallidos, preguntaSecreta, respuestaPSecreta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, null, 1, NOW(), NOW(), 0, ?, ?)",
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
          userData.preguntaSecreta,
          userData.respuestaSecreta
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
          sexo: user[0].sexo,
          correo: user[0].correo,
          imagen: user[0].imagen,
          edad: user[0].fecha_nacimiento,
          telefono: user[0].telefono,
        },
        secretKey,
        {
          expiresIn: "10s", // Puedes ajustar la duración del token según tus necesidades
        }
      );

      // Enviar una respuesta exitosa si las credenciales son válidas
      res.status(200).json({ token, message: "Inicio de sesión exitoso" });
    } catch (error) {
      // Manejar errores de validación
      if (error.name === "ValidationError") {
        const errors = error.errors.map((err) => err.message);
        return res.status(400).json({ errors });
      }

      // Manejar errores específicos de la inserción en la base de datos
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ error: "El correo electrónico ya está en uso" });
      }

      // Manejar otros tipos de errores
      console.error("Error al crear usuario:", error);
      res.status(500).json({ error: "¡Algo salió mal al crear usuario!" });
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
        return res
          .status(404)
          .json({ success: false, error: "Usuario no encontrado" });
      }

      // Verificar si la nueva contraseña es igual a la actual
      const isSamePassword = await bcrypt.compare(
        nuevaContraseña,
        user[0].contraseña
      );
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
          const formattedLastChangeDate = `${lastChangeDate.getDate()}/${
            lastChangeDate.getMonth() + 1
          }/${lastChangeDate.getFullYear()}`;

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
