const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");

const StatusVenta = sequelize.define('StatusVenta', {
  statusVentaId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  statusVenta: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'status_ventas',
  timestamps: false,
});

(async () => {
  await StatusVenta.sync();
  console.log("Modelo StatusVenta sincronizado correctamente");
})();

module.exports = StatusVenta;
