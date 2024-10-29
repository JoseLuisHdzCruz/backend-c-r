'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('productReview', {
      productReviewId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'customerId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        // Nombre único para la clave foránea de customerId
        constraintName: 'fk_productReview_customerId'
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      reviewText: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      productoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'productoId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        // Nombre único para la clave foránea de productoId
        constraintName: 'fk_productReview_productoId'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('productReview');
  }
};
