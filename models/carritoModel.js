const { DataTypes } = require('sequelize');
const sequelize = require("../src/config/database");
const Usuario = require("./usuarioModel");
const Producto = require("./productsModel");

const Carrito = sequelize.define('Carrito', {
  carritoId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuario',
      key: 'customerId'
    }
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
  cantidad: {
    type: DataTypes.INTEGER,
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
  imagen: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  tableName: 'carrito',
  timestamps: true,
});

Carrito.belongsTo(Usuario, { foreignKey: 'customerId' });
Carrito.belongsTo(Producto, { foreignKey: 'productoId' });

(async () => {
  await Carrito.sync();
})();

module.exports = Carrito;
