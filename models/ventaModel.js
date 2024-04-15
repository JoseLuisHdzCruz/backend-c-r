const { DataTypes } = require('sequelize');
const sequelize = require("../src/config/database");
const Usuario = require("./usuarioModel");
const MetodoPago = require("./metodoPago");
const StatusVenta = require("./statusVentaModel")
const Sucursal = require("./sucursalesModel")
const Domicilio = require("./domicilioModel")


const Venta = sequelize.define('Venta', {
  ventaId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  folio:{
    type: DataTypes.STRING,
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
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  totalProductos: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  totalEnvio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  totalIVA: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  motivoCancelacion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  statusVentaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'StatusVenta',
      key: 'statusVentaId'
    }
  },
  metodoPagoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'MetodoPago',
      key: 'metPagoId'
    }
  },
  socursalesId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Sucursal',
      key: 'SucursalId'
    }
  },
  domicilioId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Domicilio',
      key: 'DomicilioId'
    }
  },
}, {
  tableName: 'venta',
  timestamps: false,
});

Venta.belongsTo(Domicilio, { foreignKey: 'domicilioId' });
Venta.belongsTo(Sucursal, { foreignKey: 'socursalesId' });
Venta.hasMany(Usuario, { foreignKey: 'customerId' });
Venta.hasMany(MetodoPago, { foreignKey: 'metodoPagoId' });
Venta.hasMany(StatusVenta, { foreignKey: 'statusVentaId' });


(async () => {
  await Venta.sync();
})();

module.exports = Venta;
