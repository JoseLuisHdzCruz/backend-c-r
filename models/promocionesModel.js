const { DataTypes } = require("sequelize");
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
        type: DataTypes.NUMBER,
        allowNull: false,
      }
  },
  {
    tableName: "promociones",
    timestamps: false,
  }
);

(async () => {
  await Promociones.sync();
})();

module.exports = Promociones;
