// Importar Sequelize y configuración de conexión
const { DataTypes } = require('sequelize');
const sequelize = require("../src/config/database");
const Status = require("./statusModel");
const Usuario = require("./usuarioModel");

// Definir el modelo Cupon
const Cupon = sequelize.define('Cupon', {
  cuponId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  expiracion: {
    type: DataTypes.DATE,
    allowNull: false
  },
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuario',
      key: 'customerId'
    }
  },
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Status',
      key: 'statusId'
    }
  }
}, {
  // Opciones adicionales del modelo
  tableName: 'cupones',
  timestamps: false
});

// Establece la relación con el modelo Usuario
Cupon.belongsTo(Usuario, { foreignKey: 'customerId' });
Cupon.belongsTo(Status, { foreignKey: 'statusId' });

// Sincronizar el modelo con la base de datos
(async () => {
  await Cupon.sync();
})();

// Exportar el modelo Cupon
module.exports = Cupon;
