// Importar Sequelize y configuración de conexión
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../src/config/database");

// Definir el modelo ClavesTemporales
const ClavesTemporales = sequelize.define('ClavesTemporales', {
  keyID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clave: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expiracion: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  // Opciones adicionales del modelo
  tableName: 'claves_temporales',
  timestamps: false,
});

// Sincronizar el modelo con la base de datos
(async () => {
  await ClavesTemporales.sync();
})();

// Exportar el modelo ClavesTemporales
module.exports = ClavesTemporales;
