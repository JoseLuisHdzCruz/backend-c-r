const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");
const DetalleVenta = require("./detalleVentaModel");
const Usuario = require("./usuarioModel");
const MetodoPago = require("./metodoPago");
const StatusVenta = require("./statusVentaModel")


const Venta = sequelize.define('Venta', {
  ventaId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Usuario',
      key: 'customerId'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  statusVentaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'StatusVenta',
      key: 'statusVentaId'
    }
  },
  detalleVentaId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'DetalleVenta',
      key: 'detalleVentaId'
    }
  },
  metodoPagoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'MetodoPago',
      key: 'metPagoId'
    }
  }
}, {
  tableName: 'venta',
  timestamps: false,
});

Venta.hasMany(DetalleVenta, { foreignKey: 'detalleVentaId' });
Venta.hasMany(Usuario, { foreignKey: 'customerId' });
Venta.hasMany(MetodoPago, { foreignKey: 'metodoPagoId' });
Venta.hasMany(StatusVenta, { foreignKey: 'statusVentaId' });


(async () => {
  await Venta.sync();
  console.log("Modelo Venta sincronizado correctamente");
})();

module.exports = Venta;
