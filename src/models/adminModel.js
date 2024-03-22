const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");

const Administrador = sequelize.define('Administrador', {
  admonId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'administrador',
  timestamps: false,
});

(async () => {
  await Administrador.sync();
  console.log("Modelo Administrador sincronizado correctamente");
})();

module.exports = Administrador;
