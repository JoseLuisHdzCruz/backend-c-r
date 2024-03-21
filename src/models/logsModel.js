// Importar Sequelize y configuración de conexión
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
// const Usuario = require("./usuarioModel")


// Definir el modelo UserActivityLog
const UserActivityLog = sequelize.define('UserActivityLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  eventType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  eventDetails: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  eventDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deviceType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  httpStatusCode: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'user_activity_logs',
  timestamps: false,
});



// Sincronizar el modelo con la base de datos
(async () => {
  await UserActivityLog.sync();
  console.log("Modelo UserActivityLog sincronizado correctamente");
})();

// Exportar el modelo UserActivityLog
module.exports = UserActivityLog;
