// Importar Sequelize y configuración de conexión
const { DataTypes } = require('sequelize');
const sequelize = require("../src/config/database");
const Status = require("./statusModel");
const Categoria = require("./categoriaModel");

// Definir el modelo Producto
const Producto = sequelize.define('Producto', {
  productoId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2), // Decimal para manejar precisión de los precios
    allowNull: false
  },
  existencia: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  categoriaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Categoria, // Asegúrate de reemplazar 'Categoria' con el modelo de categoría adecuado si existe
      key: 'categoriaId'
    } 
  },
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Status, // Asegúrate de reemplazar 'Status' con el modelo de estatus adecuado si existe
      key: 'statusId'
    } 
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true
  },
  IVA: {
    type: DataTypes.DECIMAL(10, 2), // Decimal para manejar precisión de los impuestos
    allowNull: true
  },
  precioFinal: {
    type: DataTypes.DECIMAL(10, 2), // Decimal para manejar precisión de los impuestos
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  // Opciones adicionales del modelo
  tableName: 'products'
});

// Establece la relación con el modelo Producto
Producto.belongsTo(Status, { foreignKey: 'statusId' });
Producto.belongsTo(Categoria, { foreignKey: 'categoriaId' });

// Sincronizar el modelo con la base de datos
(async () => {
  await Producto.sync();
  console.log("Modelo Producto sincronizado correctamente");
})();

// Exportar el modelo Producto
module.exports = Producto;
