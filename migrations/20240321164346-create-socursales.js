'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sucursales', {
      SucursalId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Nombre: {
        type: Sequelize.STRING,
        allowNull: false
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
      Telefono: {
        type: Sequelize.STRING,
        allowNull: true
      },
      Horario: {
        type: Sequelize.STRING,
        allowNull: true
      },
      InformacionAdicional: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sucursales');
  }
};
