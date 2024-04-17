"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("notificaciones_admon", {
      notificationId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      evento: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      estado: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      admonId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "administrador",
          key: "admonId",
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("notificaciones_admon");
  },
};
