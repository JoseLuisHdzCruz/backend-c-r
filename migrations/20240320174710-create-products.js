'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      productoId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      precio: {
        type: Sequelize.DECIMAL(10, 2), // Decimal para manejar precisión de los precios
        allowNull: false
      },
      existencia: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      descuento: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      categoriaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "categoria", // Asegúrate de reemplazar 'Categoria' con el modelo de categoría adecuado si existe
          key: 'categoriaId'
        } 
      },
      statusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "status", // Asegúrate de reemplazar 'Status' con el modelo de estatus adecuado si existe
          key: 'statusId'
        } 
      },
      imagen: {
        type: Sequelize.STRING,
        allowNull: true
      },
      IVA: {
        type: Sequelize.DECIMAL(10, 2), // Decimal para manejar precisión de los impuestos
        allowNull: true
      },
      precioFinal: {
        type: Sequelize.DECIMAL(10, 2), // Decimal para manejar precisión de los impuestos
        allowNull: true
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
    await queryInterface.dropTable('products');
  }
};
