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
        }
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
        }
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
