const { DataTypes } = require('sequelize');
const sequelize = require("../src/config/database");


const TempVenta = sequelize.define('TempVenta', {
  ventaId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  folio:{
    type: DataTypes.STRING,
    allowNull: false
  },
  no_transaccion:{
    type: DataTypes.STRING,
    allowNull: true
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  totalProductos: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  totalEnvio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  totalIVA: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  statusVentaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  metodoPagoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  socursalesId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  domicilioId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
}, {
  tableName: 'temp_venta',
  timestamps: false,
});

(async () => {
  await TempVenta.sync();
})();

module.exports = TempVenta;
