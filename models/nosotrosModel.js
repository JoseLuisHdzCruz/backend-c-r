// Importar Sequelize y configuración de conexión
const { DataTypes } = require('sequelize');
const sequelize = require("../src/config/database");

// Definir el modelo Nosotros
const Nosotros = sequelize.define('Nosotros', {
    nosotrosId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      quienesSomos: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      mision: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      vision: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      facebook: {
        type: DataTypes.STRING,
        allowNull: false
      },
      correo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      telefono: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
}, {
  // Opciones adicionales del modelo
  tableName: 'nosotros'
});

// Sincronizar el modelo con la base de datos
(async () => {
  await Nosotros.sync();
})();

// Exportar el modelo ClavesTemporales
module.exports = Nosotros;
