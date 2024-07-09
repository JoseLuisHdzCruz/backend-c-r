const NotificacionesAdmin = require("../../../models/notificacionesAdminModel");
const Empleado = require('../../../models/empleadoModel');
const Administrador = require('../../../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

      res.status(200).json({ message: 'Empleado actualizado exitosamente', employee });
    } catch (error) {
      console.error('Error al actualizar el empleado:', error);
      res.status(500).json({ error: '¡Algo salió mal al actualizar el empleado!' });
    }
  },

  addEmployee: async (req, res) => {
    const employeeData = req.body;
    console.log("valores: " + employeeData)

    try {
      // Verificar si el correo ya está registrado
      const existingEmployee = await Empleado.findOne({ where: { correo: employeeData.correo } });
      if (existingEmployee) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(employeeData.contraseña, 10);

      // Crear el nuevo empleado
      const newEmployee = await Empleado.create({
        nombre: employeeData.nombre,
        apPaterno: employeeData.apPaterno,
        apMaterno: employeeData.apMaterno,
        statusId : 1,
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

      res.status(201).json({ message: 'Empleado registrado exitosamente', newEmployee });
    } catch (error) {
      console.error('Error al registrar el empleado:', error);
      res.status(500).json({ error: '¡Algo salió mal al registrar el empleado!' });
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
      res
        .status(500)
        .json({
          error: "¡Algo salió mal al obtener todas las notificaciones!",
        });
    }
  },

  login: async (req, res) => {
    const { role, correo, contraseña } = req.body;
    const secretKey = process.env.JWT_SECRET;
    console.log(
      "rol: " + role + ", correo: " + correo + ", contraseña: " + contraseña
    )
    try {
      let user;

      if (role === 'Administrador') {
        user = await Administrador.findOne({ where: { correo } });
      } else if (role === 'Empleado') {
        user = await Empleado.findOne({ where: { correo } });
      } else {
        return res.status(400).json({ error: 'Rol no válido' });
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
          id: role === 'Administrador' ? user.admonId : user.empleadoId,
          nombre: user.nombre,
          apellidos: user.apPaterno ? user.apPaterno + ' ' + user.apMaterno : user.apellidos,
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
