const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");
const Usuario = require("./usuarioModel");

const Carrito = sequelize.define('Carrito', {
  carritoId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Usuario',
      key: 'customerId'
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
  }
}, {
  tableName: 'carrito',
  timestamps: false,
});

Carrito.belongsTo(Usuario, { foreignKey: 'customerId' });

(async () => {
  await Carrito.sync();
  console.log("Modelo Carrito sincronizado correctamente");
})();

module.exports = Carrito;
