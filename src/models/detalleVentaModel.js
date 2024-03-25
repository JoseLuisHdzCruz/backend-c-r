const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");
const Producto = require("./productsModel")

const DetalleVenta = sequelize.define('DetalleVenta', {
  detalleVentaId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productoId: {
    type: DataTypes.UUID,
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
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalDV: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'detalle_ventas',
  timestamps: false,
});


// Establece la relación con el modelo Producto
DetalleVenta.belongsTo(Producto, { foreignKey: 'productoId' });

(async () => {
  await DetalleVenta.sync();
  console.log("Modelo DetalleVenta sincronizado correctamente");
})();

module.exports = DetalleVenta;
