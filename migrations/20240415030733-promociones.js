"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("promociones", {
      promocionId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      evento: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fecha_inicio: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      fecha_final: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      descuento: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      categoriaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "categoria", // Asegúrate de reemplazar 'Categoria' con el modelo de categoría adecuado si existe
          key: 'categoriaId'
        } 
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("promociones");
  },
};
