// Importar Sequelize y configuración de conexión
const { DataTypes } = require('sequelize');
const sequelize = require("../src/config/database");

// Definir el modelo Status
const Categoria = sequelize.define('Categoria', {
  categoriaId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Opciones adicionales del modelo
  tableName: 'categoria',
  timestamps: false,
});

// Sincronizar el modelo con la base de datos
(async () => {
  await Categoria.sync();
})();

// Exportar el modelo Categoria
module.exports = Categoria;
