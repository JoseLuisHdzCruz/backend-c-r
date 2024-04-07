'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('temp_venta', {
      ventaId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      folio:{
        type: Sequelize.STRING,
        allowNull: false
      },
      no_transaccion:{
        type: Sequelize.STRING,
        allowNull: true
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
      statusVentaId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      metodoPagoId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      socursalesId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      domicilioId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('temp_venta');
  }
};
