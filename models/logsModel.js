// Importar Sequelize y configuración de conexión
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');
const Usuario = require("./usuarioModel")


// Definir el modelo UserActivityLog
const UserActivityLog = sequelize.define('UserActivityLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'Usuario',
        key: 'customerId'
      }
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

// Establece la relación con el modelo Usuario
UserActivityLog.belongsTo(Usuario, { foreignKey: 'userId' });

// Sincronizar el modelo con la base de datos
(async () => {
  await UserActivityLog.sync();
})();

// Exportar el modelo UserActivityLog
module.exports = UserActivityLog;
