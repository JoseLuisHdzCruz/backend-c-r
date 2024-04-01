// Importar Sequelize y configuración de conexión
const { DataTypes } = require("sequelize");
const sequelize = require("../src/config/database");

// Definir el modelo Colonia
const Colonia = sequelize.define(
  "Colonia",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    colonia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codigo_postal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    municipio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Opciones adicionales del modelo
    tableName: "colonias",
    timestamps: false,
  }
);

// Sincronizar el modelo con la base de datos
(async () => {
  await Colonia.sync();
  console.log("Modelo Colonia sincronizado correctamente");
})();

// Exportar el modelo Colonia
module.exports = Colonia;
