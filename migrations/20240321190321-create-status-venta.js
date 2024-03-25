'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('status_ventas', {
      statusVentaId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      statusVenta: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('status_ventas');
  }
};
