const { DataTypes } = require("sequelize");
const sequelize = require("../src/config/database");
const Usuario = require("./usuarioModel");

const NotificacionesPush = sequelize.define(
  "NotificacionesPush",
  {
    pushId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Usuario",
        key: "customerId",
      },
    },
    endpoint: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    keys: {
      type: DataTypes.TEXT, // Cambiado de JSON a TEXT
      allowNull: false,
      get() {
        const rawData = this.getDataValue("keys");
        return rawData ? JSON.parse(rawData) : null;
      },
      set(value) {
        this.setDataValue("keys", JSON.stringify(value));
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "notificaciones_push",
    timestamps: false,
  }
);

// Relación con el modelo de Usuario
NotificacionesPush.belongsTo(Usuario, { foreignKey: "customerId" });

(async () => {
  await NotificacionesPush.sync();
})();

module.exports = NotificacionesPush;
