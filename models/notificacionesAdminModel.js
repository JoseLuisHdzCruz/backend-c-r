const { DataTypes } = require("sequelize");
const sequelize = require("../src/config/database");
const Administrador = require("./adminModel");

const NotificacionesAdmin = sequelize.define(
  "NotificacionesAdmin",
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
    admonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Administrador",
        key: "admonId",
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
    tableName: "notificaciones_admon",
    timestamps: false,
  }
);

NotificacionesAdmin.hasMany(Administrador, { foreignKey: "admonId" });

(async () => {
  await NotificacionesAdmin.sync();
})();

module.exports = NotificacionesAdmin;
