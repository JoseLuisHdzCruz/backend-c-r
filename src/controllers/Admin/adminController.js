const NotificacionesAdmin = require("../../../models/notificacionesAdminModel");
const Empleado = require("../../../models/empleadoModel");
const Administrador = require("../../../models/adminModel");
const UserActivityLog = require("../../../models/logsModel");
const Nosotros = require("../../../models/nosotrosModel");4
const Promociones = require("../../../models/promocionesModel");
const Usuario = require("../../../models/usuarioModel");
const ClavesTemporales = require("../../../models/clavesTemporalesModels");
const Cupon = require("../../../models/cuponModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const {
  enviarCorreoValidacion,
  enviarCorreoInicioSesionExitoso,
  enviarCorreoIntentoSesionSospechoso,
  enviarCorreoCambioContraseña,
} = require("../../services/emailService");

const generateUniqueCode = async () => {
  let code;
  let existingCoupon;
  do {
    code = Math.random().toString(36).substring(2, 7).toUpperCase();
    existingCoupon = await Cupon.findOne({ where: { codigo: code } });
  } while (existingCoupon);
  return code;
};

const adminController = {
  getAllEmpleados: async (req, res, next) => {
    try {
      const employs = await Empleado.findAll();
      res.json(employs);
    } catch (error) {
      console.error("Error al obtener los empleados:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al obtener los empleados!" });
    }
  },

  createCoupon: async (req, res) => {
    const { monto, usuarioId } = req.body;
    try {
      const codigo = await generateUniqueCode();
      const expiracion = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // 5 días de expiración
      const nuevoCupon = await Cupon.create({
        codigo,
        monto,
        customerId: usuarioId,
        expiracion,
        statusId: 1, // Activo
      });
      res
        .status(201)
        .json({ message: "Cupón creado exitosamente", cupon: nuevoCupon });
    } catch (error) {
      console.error("Error al crear el cupón:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al crear el cupón!" });
    }
  },

  getAllCoupons: async (req, res) => {
    try {
      const cupones = await Cupon.findAll();
      res.json(cupones);
    } catch (error) {
      console.error("Error al obtener los cupones:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al obtener los cupones!" });
    }
  },

  getAllPromociones: async (req, res, next) => {
    try {
      const offerts = await Promociones.findAll();
      res.json(offerts);
    } catch (error) {
      console.error("Error al obtener los empleados:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al obtener los empleados!" });
    }
  },

  updatePromocion: async (req, res) => {
    const { id } = req.params;
    const { evento, fecha_inicio, fecha_final, descuento, categoriaId } =
      req.body;

    try {
      const promocion = await Promociones.findByPk(id);
      if (!promocion) {
        return res.status(404).json({ message: "Promoción no encontrada" });
      }

      promocion.evento = evento;
      promocion.fecha_inicio = fecha_inicio;
      promocion.fecha_final = fecha_final;
      promocion.descuento = descuento;
      promocion.categoriaId = categoriaId;

      await promocion.save();

      res
        .status(200)
        .json({ message: "Promoción actualizada exitosamente", promocion });
    } catch (error) {
      console.error("Error al actualizar la promoción:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al actualizar la promoción!" });
    }
  },

  createPromocion: async (req, res) => {
    const { evento, fecha_inicio, fecha_final, descuento, categoriaId } = req.body;
  
    try {
      const nuevaPromocion = await Promociones.create({
        evento,
        fecha_inicio,
        fecha_final,
        descuento,
        categoriaId,
      });
  
      res
        .status(201)
        .json({ message: "Promoción creada exitosamente", promocion: nuevaPromocion });
    } catch (error) {
      console.error("Error al crear la promoción:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al crear la promoción!" });
    }
  },

  verificarCorreoYEnviarClave: async (req, res, next) => {
    const { correo, role } = req.body;
    let user;
    try {
      // Verificar si el correo existe en la base de datos
      if (role === "Administrador"){
        user = await Administrador.findOne({ where: { correo } });
      }else if (role === "Empleado"){
        user = await Empleado.findOne({ where: { correo } });
      }

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
    const { correo, nuevaContraseña, role } = req.body;
    let user;

    try {
      if (role === "Administrador"){
        user = await Administrador.findOne({ where: { correo } });
      }else if (role === "Empleado"){
        user = await Empleado.findOne({ where: { correo } });
      }

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

      // Encriptar la nueva contraseña
      const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

      // Actualizar la contraseña en la base de datos
      await user.update({ contraseña: hashedPassword });


      // Enviar correo electrónico de cambio de contraseña
      await enviarCorreoCambioContraseña(correo);

      // Registrar la actividad del usuario
      await UserActivityLog.create({
        userId: role === "Administrador" ? user.admonId : user.empleadoId,
        eventType: "Cambio de contraseña",
        eventDetails: `Se cambió la contraseña del ${role === "Administrador" ? "administrador" : "empleado"} ${user.nombre} con el correo (${user.correo}).`,
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

  // adminController.js

  updateUserStatus: async (req, res) => {
    const { id } = req.params;
    const { statusId } = req.body;

    try {
      const user = await Usuario.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      user.statusId = statusId;
      await user.save();

      res
        .status(200)
        .json({ message: "Estado del usuario actualizado exitosamente", user });
    } catch (error) {
      console.error("Error al actualizar el estado del usuario:", error);
      res
        .status(500)
        .json({
          error: "¡Algo salió mal al actualizar el estado del usuario!",
        });
    }
  },

  // Obtener un registro de Nosotros por ID
  getNosotrosById: async (req, res) => {
    const { id } = req.params;
    try {
      const nosotros = await Nosotros.findByPk(id);
      if (!nosotros) {
        return res
          .status(404)
          .json({ message: "No se encontró el registro de Nosotros" });
      }
      res.status(200).json(nosotros);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Actualizar un registro de Nosotros por ID
  updateNosotrosById: async (req, res) => {
    const { id } = req.params;
    const {
      descripcion,
      quienesSomos,
      mision,
      vision,
      facebook,
      correo,
      telefono,
    } = req.body;

    try {
      const nosotros = await Nosotros.findByPk(id);
      if (!nosotros) {
        return res
          .status(404)
          .json({ message: "No se encontró el registro de Nosotros" });
      }

      nosotros.descripcion = descripcion;
      nosotros.quienesSomos = quienesSomos;
      nosotros.mision = mision;
      nosotros.vision = vision;
      nosotros.facebook = facebook;
      nosotros.correo = correo;
      nosotros.telefono = telefono;

      await nosotros.save();

      res
        .status(200)
        .json({
          message: "Registro de Nosotros actualizado exitosamente",
          nosotros,
        });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  searchUsersAdvance: async (req, res, next) => {
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
      const users = await Empleado.findAll({
        where: conditions,
      });

      // Responder con los usuarios encontrados
      res.json(users);
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      res.status(500).json({ error: "¡Algo salió mal al buscar usuarios!" });
    }
  },

  getEmployeetById: async (req, res, next) => {
    const empleadoId = req.params.id;
    try {
      const employ = await Empleado.findByPk(empleadoId);
      if (employ) {
        res.json(employ);
      } else {
        res.status(404).json({ message: "Empleado no encontrado" });
      }
    } catch (error) {
      console.error("Error al obtener empleado por ID:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al obtener empleado por ID!" });
    }
  },

  updateEmployee: async (req, res) => {
    const empleadoId = req.params.id;
    const updatedData = req.body;

    try {
      // Buscar el empleado por ID
      const employee = await Empleado.findByPk(empleadoId);
      if (!employee) {
        return res.status(404).json({ message: "Empleado no encontrado" });
      }

      // // Verificar si se proporciona una nueva contraseña y encriptarla
      // if (updatedData.contraseña) {
      //   updatedData.contraseña = await bcrypt.hash(updatedData.contraseña, 10);
      // }

      // Actualizar los datos del empleado
      await employee.update(updatedData);

      res
        .status(200)
        .json({ message: "Empleado actualizado exitosamente", employee });
    } catch (error) {
      console.error("Error al actualizar el empleado:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al actualizar el empleado!" });
    }
  },

  addEmployee: async (req, res) => {
    const employeeData = req.body;
    console.log("valores: " + employeeData);

    try {
      // Verificar si el correo ya está registrado
      const existingEmployee = await Empleado.findOne({
        where: { correo: employeeData.correo },
      });
      if (existingEmployee) {
        return res.status(400).json({ error: "El correo ya está registrado" });
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(employeeData.contraseña, 10);

      // Crear el nuevo empleado
      const newEmployee = await Empleado.create({
        nombre: employeeData.nombre,
        apPaterno: employeeData.apPaterno,
        apMaterno: employeeData.apMaterno,
        statusId: 1,
        Telefono: employeeData.Telefono,
        CP: employeeData.CP,
        Calle: employeeData.Calle,
        Colonia: employeeData.Colonia,
        Estado: employeeData.Estado,
        Ciudad: employeeData.Ciudad,
        NumInterior: employeeData.NumInterior,
        NumExterior: employeeData.NumExterior,
        Referencias: employeeData.Referencias,
        correo: employeeData.correo,
        contraseña: hashedPassword,
      });

      res
        .status(201)
        .json({ message: "Empleado registrado exitosamente", newEmployee });
    } catch (error) {
      console.error("Error al registrar el empleado:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al registrar el empleado!" });
    }
  },

  getAllNotifications: async (req, res, next) => {
    const { admonId } = req.params;
    try {
      const notificaciones = await NotificacionesAdmin.findAll({
        where: {
          admonId, // Filtrar por customerId
        },
      });
      res.json(notificaciones);
    } catch (error) {
      console.error("Error al obtener todas las notificaciones:", error);
      res.status(500).json({
        error: "¡Algo salió mal al obtener todas las notificaciones!",
      });
    }
  },

  login: async (req, res) => {
    const { role, correo, contraseña } = req.body;
    const secretKey = process.env.JWT_SECRET;
    try {
      let user;

      if (role === "Administrador") {
        user = await Administrador.findOne({ where: { correo } });
      } else if (role === "Empleado") {
        user = await Empleado.findOne({ where: { correo } });
      } else {
        return res.status(400).json({ error: "Rol no válido" });
      }

      if (!user) {
        return res.status(401).json({
          error: "El correo ingresado no está asociado a una cuenta",
        });
      }

      const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
      }

      const token = jwt.sign(
        {
          id: role === "Administrador" ? user.admonId : user.empleadoId,
          nombre: user.nombre,
          apellidos: user.apPaterno
            ? user.apPaterno + " " + user.apMaterno
            : user.apellidos,
          correo: user.correo,
          role,
        },
        secretKey,
        {
          expiresIn: "24h",
        }
      );

      res.status(200).json({ token, message: "Inicio de sesión exitoso" });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      res.status(500).json({ error: "¡Algo salió mal al iniciar sesión!" });
    }
  },
};

module.exports = adminController;
