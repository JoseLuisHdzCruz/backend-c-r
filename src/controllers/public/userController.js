// /src/controllers/userController.js

const db = require("../../config/database");
const Yup = require("yup");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const secretKey = process.env.JWT_SECRET;
const email = process.env.USER_EMAIL;
const pass = process.env.PASS_EMAIL;


const enviarCorreoValidacion = async (correo, clave) => {
  try {
    // Configurar el tiempo de expiración de la clave (5 minutos)
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 5); // Añadir 5 minutos

    // Consultar si ya existe un registro asociado al correo en la tabla de claves temporales
    const existingRecord = await db.query(
      "SELECT * FROM claves_temporales WHERE correo = ?",
      [correo]
    );

    if (existingRecord.length > 0) {
      // Si ya existe un registro, actualizarlo con los nuevos valores de clave y expiración
      await db.query(
        "UPDATE claves_temporales SET clave = ?, expiracion = ? WHERE correo = ?",
        [clave, expirationTime, correo]
      );
    } else {
      // Si no existe un registro, insertar uno nuevo
      await db.query(
        "INSERT INTO claves_temporales (correo, clave, expiracion) VALUES (?, ?, ?)",
        [correo, clave, expirationTime]
      );
    }

    // Configurar el servicio de correo electrónico
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email, // Cambiar por tu dirección de correo electrónico
        pass: pass, // Cambiar por tu contraseña
      },
    });

    // Configurar el mensaje de correo electrónico
    const mensaje = {
      from: email, // Cambiar por tu dirección de correo electrónico
      to: correo,
      subject: "Clave de validación",
      text: `Tu clave de validación es: ${clave}, esta clave expirar en 5 minutos`,
    };

    // Enviar el correo electrónico
    await transporter.sendMail(mensaje);
    console.log("Correo electrónico enviado con éxito");
  } catch (error) {
    console.error("Error al enviar correo electrónico:", error);
    throw new Error("Error al enviar correo electrónico");
  }
};



const validationSchema = Yup.object().shape({
  nombre: Yup.string()
    .matches(
      /^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s]+$/,
      "El nombre solo puede contener letras, acentos y espacios"
    )
    .min(3, "El nombre debe tener al menos 10 caracteres")
    .max(20, "El nombre no puede tener más de 50 caracteres")
    .required("El nombre es obligatorio"),
  aPaterno: Yup.string()
    .matches(
      /^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s]+$/,
      "El nombre solo puede contener letras, acentos y espacios"
    )
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(15, "El nombre no puede tener más de 15 caracteres")
    .required("El nombre es obligatorio"),
  aMaterno: Yup.string()
    .matches(
      /^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s]+$/,
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
      const users = await db.query("SELECT * FROM usuarios");
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
        "SELECT * FROM usuarios WHERE custumerId = ?",
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
        "UPDATE usuarios SET intentosFallidos = 0 WHERE correo = ?",
        [correo]
      );

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

      // Enviar la clave por correo electrónico
      await enviarCorreoValidacion(correo, clave.toString());

      res
        .status(200)
        .json({
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
        return res.status(404).json({ success: false, message: "No se encontró una clave temporal asociada al correo proporcionado" });
      }
  
      // Verificar si la clave recibida coincide con la clave almacenada
      if (clave === claveTemporal.clave) {
        // Verificar si la clave ha expirado
        if (new Date() <= new Date(claveTemporal.expiracion)) {
          // La clave es válida y no ha expirado
          return res.status(200).json({ success: true, message: "Clave verificada con éxito" });
        } else {
          // La clave ha expirado
          return res.status(400).json({ success: false, message: "La clave ha expirado" });
        }
      } else {
        // La clave no coincide
        return res.status(400).json({ success: false, message: "La clave no coincide" });
      }
    } catch (error) {
      console.error("Error al comparar claves:", error);
      return res.status(500).json({ success: false, error: "Error al comparar claves" });
    }
  },

  cambiarContraseña: async (req, res, next) => {
    const { correo, nuevaContraseña } = req.body;

    try {
      // Consultar la contraseña actual del usuario
      const user = await db.query(
        "SELECT contraseña FROM usuarios WHERE correo = ?",
        [correo]
      );

      // Verificar si se encontró al usuario
      if (user.length === 0) {
        return res.status(404).json({ success: false, error: "Usuario no encontrado" });
      }

      // Verificar si la nueva contraseña es igual a la actual
      const isSamePassword = await bcrypt.compare(nuevaContraseña, user[0].contraseña);
      if (isSamePassword) {
        return res.status(400).json({ success: false, error: "La nueva contraseña debe ser diferente de la actual" });
      }

      // Encriptar la nueva contraseña
      const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

      // Actualizar la contraseña en la base de datos
      await db.query(
        "UPDATE usuarios SET contraseña = ? WHERE correo = ?",
        [hashedPassword, correo]
      );

      // Responder con un mensaje de éxito
      res.status(200).json({ success: true, message: "Contraseña actualizada exitosamente" });
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      res.status(500).json({ success: false, error: "¡Algo salió mal al cambiar la contraseña!" });
    }
  },

  
  
};
