'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('venta', {
      ventaId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      folio:{
        type: Sequelize.STRING,
        allowNull: false
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'customerId'
        }
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      totalProductos: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      totalEnvio: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      totalIVA: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: false
      },
      motivoCancelacion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      statusVentaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'status_ventas',
          key: 'statusVentaId'
        }
      },
      metodoPagoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'metodosPago',
          key: 'metPagoId'
        }
      },
      socursalesId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'sucursales',
          key: 'SucursalId'
        }
      },
      domicilioId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'domicilio',
          key: 'DomicilioId'
        }
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('venta');
  }
};
