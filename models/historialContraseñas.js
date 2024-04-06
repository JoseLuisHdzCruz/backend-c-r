// Importar Sequelize y configuración de conexión
const { DataTypes } = require('sequelize');
const sequelize = require("../src/config/database");
const Usuario = require("./usuarioModel")

// Definir el modelo HistorialContrasenas
const HistorialContrasenas = sequelize.define('HistorialContrasenas', {
  contraseñasId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuario',
      key: 'customerId'
    }
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha_cambio: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  // Opciones adicionales del modelo
  tableName: 'historial_contraseñas',
  timestamps: false,
});

// Establece la relación con el modelo Usuario
HistorialContrasenas.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Sincronizar el modelo con la base de datos
(async () => {
  await HistorialContrasenas.sync();
})();

// Exportar el modelo HistorialContrasenas
module.exports = HistorialContrasenas;
