const { DataTypes } = require('sequelize');
const sequelize = require("../src/config/database");

const MetodoPago = sequelize.define('MetodoPago', {
  metPagoId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  metodoPago: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'metodosPago',
  timestamps: false,
});

(async () => {
  await MetodoPago.sync();
  console.log("Modelo MetodoPago sincronizado correctamente");
})();

module.exports = MetodoPago;
