const { DataTypes } = require('sequelize');
const sequelize = require("../src/config/database");
const Usuario = require("./usuarioModel");
const Producto = require("./productsModel");


const ProductReview = sequelize.define('ProductReview', {
  productReviewId: {
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
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reviewText: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  productoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Producto',
      key: 'productoId'
    }
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
  tableName: 'productReview',
  timestamps: true,
});

// Definición de relaciones
ProductReview.belongsTo(Usuario, { foreignKey: 'customerId' });
ProductReview.belongsTo(Producto, { foreignKey: 'productoId' });

Usuario.hasMany(ProductReview, { foreignKey: 'customerId' });
Producto.hasMany(ProductReview, { foreignKey: 'productoId' });


(async () => {
  await ProductReview.sync();
})();

module.exports = ProductReview;
