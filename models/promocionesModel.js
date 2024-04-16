const { DataTypes } = require("sequelize");
const Categoria = require("./categoriaModel");
const sequelize = require("../src/config/database");

const Promociones = sequelize.define(
  "Promociones",
  {
    promocionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      evento: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      fecha_final: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      descuento: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      categoriaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Categoria, // Asegúrate de reemplazar 'Categoria' con el modelo de categoría adecuado si existe
          key: 'categoriaId'
        } 
      },
  },
  {
    tableName: "promociones",
    timestamps: false,
  }
);

Promociones.belongsTo(Categoria, { foreignKey: 'categoriaId' });


(async () => {
  await Promociones.sync();
})();

module.exports = Promociones;
