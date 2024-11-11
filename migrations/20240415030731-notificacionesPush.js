"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("notificaciones_push", {
      pushId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "usuarios", // Nombre de la tabla de Usuario
          key: "customerId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      endpoint: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      keys: {
        type: Sequelize.TEXT, // Usar TEXT si solo necesitas texto
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("notificaciones_push");
  },
};
