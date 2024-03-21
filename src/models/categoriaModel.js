// Importar Sequelize y configuración de conexión
const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");

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
  console.log("Modelo Categoria sincronizado correctamente");
})();

// Exportar el modelo Categoria
module.exports = Categoria;
