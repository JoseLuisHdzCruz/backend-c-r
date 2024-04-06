const { DataTypes } = require('sequelize');
const sequelize = require("../src/config/database");

const Sucursal = sequelize.define('Sucursal', {
  SucursalId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
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
  Telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Horario: {
    type: DataTypes.STRING,
    allowNull: true
  },
  InformacionAdicional: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'sucursales',
  timestamps: false,
});

(async () => {
  await Sucursal.sync();
})();

module.exports = Sucursal;
