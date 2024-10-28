// Importar Sequelize y configuración de conexión
const { DataTypes } = require('sequelize');
const sequelize = require("../src/config/database");
const Status = require("./statusModel")

// Definir el modelo Usuario
const Usuario = sequelize.define('Usuario', {
  customerId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  aPaterno: {
    type: DataTypes.STRING,
    allowNull: false
  },
  aMaterno: {
    type: DataTypes.STRING,
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sexo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ultimoAcceso: {
    type: DataTypes.DATE,
    allowNull: true
  },
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Status",
      key: 'statusId'
    } 
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  intentosFallidos: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  ultimoIntentoFallido: {
    type: DataTypes.DATE,
    allowNull: true
  },
  preguntaSecreta: {
    type: DataTypes.STRING,
    allowNull: false
  },
  respuestaPSecreta: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fcmToken: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true
  },
  encuestado: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  // Opciones adicionales del modelo
  tableName: 'usuarios'
});

// Establece la relación con el modelo Usuario
Usuario.belongsTo(Status, { foreignKey: 'statusId' });

// Sincronizar el modelo con la base de datos
(async () => {
  await Usuario.sync();
})();

// Exportar el modelo ClavesTemporales
module.exports = Usuario;
