const { DataTypes } = require('sequelize');
const sequelize = require("../src/config/database");
const Producto = require("./productsModel")
const Venta = require("./ventaModel")

const DetalleVenta = sequelize.define('DetalleVenta', {
  detalleVentaId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  productoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Producto',
      key: 'productoId'
    }
  },
  producto: {
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
    allowNull: false,
    references: {
      model: 'Venta',
      key: 'ventaId'
    }
  },
}, {
  tableName: 'detalle_ventas',
  timestamps: false,
});


// Establece la relación con el modelo Producto
DetalleVenta.belongsTo(Producto, { foreignKey: 'productoId' });
DetalleVenta.belongsTo(Venta, { foreignKey: 'ventaId' });

(async () => {
  await DetalleVenta.sync();
  console.log("Modelo DetalleVenta sincronizado correctamente");
})();

module.exports = DetalleVenta;
