'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('claves_temporales', {
      keyID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      correo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      clave: {
        type: Sequelize.STRING,
        allowNull: false
      },
      expiracion: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('claves_temporales');
  }
};
