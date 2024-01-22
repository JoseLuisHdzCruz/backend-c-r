// /src/controllers/userController.js

const db = require("../../config/database");
const Yup = require("yup");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');



const validationSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(10, "El nombre debe tener al menos 10 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres")
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
      const existingUser = await db.query('SELECT * FROM usuarios WHERE correo = ?', [userData.correo]);
  
      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
      }
  
      // Generar un id único
      const userId = uuidv4();
  
      // Convertir fecha_nacimiento a un objeto de fecha
      userData.fecha_nacimiento = new Date(userData.fecha_nacimiento);
  
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(userData.contraseña, 10);
  
      // Insertar el nuevo usuario en la base de datos con la contraseña encriptada
      const result = await db.query('INSERT INTO usuarios (customerId, nombre, correo, telefono, sexo, fecha_nacimiento, contraseña, ultimoAcceso, statusId, domicilioId, created, modified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [userId, userData.nombre, userData.correo, userData.telefono, userData.sexo, userData.fecha_nacimiento, hashedPassword, null, 1, '']);
  
      // Obtener el usuario recién creado
      const nuevoUsuario = await db.query('SELECT * FROM usuarios WHERE customerId = ?', [userId]);
  
      // Responder con el nuevo usuario
      res.status(201).json(nuevoUsuario[0]);
    } catch (error) {
      // Manejar errores de validación
      if (error.name === 'ValidationError') {
        const errors = error.errors.map(err => err.message);
        return res.status(400).json({ errors });
      }
  
      console.error('Error al crear usuario:', error);
      res.status(500).json({ error: '¡Algo salió mal al crear usuario!' });
    }
  },

    loginUser: async (req, res, next) => {
      const { correo, contraseña } = req.body;

      try {
        // Validar los datos usando Yup
        await loginValidationSchema.validate({ correo, contraseña }, { abortEarly: false });

        // Buscar usuario por correo
        const user = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

        if (user.length === 0) {
          return res.status(401).json({ error: 'El correo ingresado no esta asociado a una cuenta' });
        }

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(contraseña, user[0].contraseña);
        
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Verificar si el usuario está activo
        if (user[0].statusId !== 1) {
          return res.status(403).json({ error: 'Usuario no activo' });
        }

        // Enviar una respuesta exitosa si las credenciales son válidas
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
      } catch (error) {
        // Manejar errores de validación
        if (error.name === 'ValidationError') {
          const errors = error.errors.map(err => err.message);
          return res.status(400).json({ errors });
        }

        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: '¡Algo salió mal al iniciar sesión!' });
      }
    },
  

  // Puedes agregar funciones para actualizar y eliminar usuarios aquí
};
