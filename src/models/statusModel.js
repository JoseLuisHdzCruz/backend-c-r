// Importar Sequelize y configuración de conexión
const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");

// Definir el modelo Status
const Status = sequelize.define('Status', {
  statusId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Opciones adicionales del modelo
  tableName: 'status',
  timestamps: false,
});

// Sincronizar el modelo con la base de datos
(async () => {
  await Status.sync();
  console.log("Modelo Status sincronizado correctamente");
})();

// Exportar el modelo Status
module.exports = Status;
