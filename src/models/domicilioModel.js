const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");
const Usuario = require("./usuarioModel");

const Domicilio = sequelize.define('Domicilio', {
  DomicilioId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  Telefono: {
    type: DataTypes.STRING,
    allowNull: false
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
    type: DataTypes.UUID,
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
