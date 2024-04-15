const { DataTypes } = require("sequelize");
const sequelize = require("../src/config/database");
const Usuario = require("./usuarioModel");

const Notificaciones = sequelize.define(
  "Notificaciones",
  {
    notificationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    evento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Usuario",
        key: "customerId",
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "notificaciones",
    timestamps: false,
  }
);

Notificaciones.hasMany(Usuario, { foreignKey: "customerId" });

(async () => {
  await Notificaciones.sync();
})();

module.exports = Notificaciones;
