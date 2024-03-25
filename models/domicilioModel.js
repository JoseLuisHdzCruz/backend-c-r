const { DataTypes } = require('sequelize');
const sequelize = require("../src/config/database");
const Usuario = require("./usuarioModel");

const Domicilio = sequelize.define('Domicilio', {
  DomicilioId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  CP: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Calle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Colonia: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Estado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Ciudad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Referencias: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuario',
      key: 'customerId'
    }
  }
}, {
  tableName: 'domicilio',
  timestamps: false,
});

Domicilio.belongsTo(Usuario, { foreignKey: 'customerId' });

(async () => {
  await Domicilio.sync();
  console.log("Modelo Domicilio sincronizado correctamente");
})();

module.exports = Domicilio;