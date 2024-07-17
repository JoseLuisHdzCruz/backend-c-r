'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('nosotros', {
      nosotrosId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      quienesSomos: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      mision: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      vision: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      facebook: {
        type: Sequelize.STRING,
        allowNull: false
      },
      correo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      telefono: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
      
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('nosotros');
  }
};
