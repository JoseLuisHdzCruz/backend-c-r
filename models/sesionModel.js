// Importar Sequelize y configuración de conexión
const { DataTypes } = require('sequelize');
const sequelize = require("../src/config/database");
const Usuario = require("./usuarioModel")

// Definir el modelo Session
const Session = sequelize.define('Session', {
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
  sessionId: {
    type: DataTypes.STRING,
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
}, {
  // Opciones adicionales del modelo
  tableName: 'sessions',
  timestamps: false,
});

// Establece la relación con el modelo Usuario
Session.belongsTo(Usuario, { foreignKey: 'userId' });


(async () => {
  await Session.sync();
})();

// Exportar el modelo Session
module.exports = Session;
