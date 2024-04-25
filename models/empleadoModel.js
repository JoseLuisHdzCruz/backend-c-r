const { DataTypes } = require('sequelize');
const sequelize = require("../src/config/database");
const Status = require("./statusModel")

const Empleado = sequelize.define('Empleado', {
    empleadoId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      apPaterno: {
        type: DataTypes.STRING,
        allowNull: false
      },
      apMaterno: {
        type: DataTypes.STRING,
        allowNull: false
      },
      statusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Status",
          key: 'statusId'
        } 
      },
      Telefono: {
        type: DataTypes.STRING,
        allowNull: false
      },
      CP: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Calle: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Colonia: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Estado: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Ciudad: {
        type: DataTypes.STRING,
        allowNull: false
      },
      NumInterior: {
        type: DataTypes.STRING,
        allowNull: true
      },
      NumExterior: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Referencias: {
        type: DataTypes.TEXT,
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
      }
}, {
  tableName: 'empleados',
  timestamps: false,
});

// Establece la relación con el modelo Usuario
Empleado.belongsTo(Status, { foreignKey: 'statusId' });

(async () => {
  await Empleado.sync();
})();

module.exports = Empleado;
