'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('colonias', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      colonia: {
        type: Sequelize.STRING,
        allowNull: false
      },
      codigo_postal: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '43000' // Establecer el valor predeterminado del código postal
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('colonias');
  }
};
