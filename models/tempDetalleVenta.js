const { DataTypes } = require('sequelize');
const sequelize = require("../src/config/database");

const TempDetalleVenta = sequelize.define('TempDetalleVenta', {
  detalleVentaId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  productoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  producto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  IVA: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalDV: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  ventaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  tableName: 'temp_detalle_ventas',
  timestamps: false,
});


(async () => {
  await TempDetalleVenta.sync();
})();

module.exports = TempDetalleVenta;
