'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('domicilio', {
      DomicilioId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      CP: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Calle: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Colonia: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Estado: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Ciudad: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Referencias: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'customerId'
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('domicilio');
  }
};