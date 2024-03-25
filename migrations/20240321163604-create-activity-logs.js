'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_activity_logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'customerId'
          }
      },
      eventType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      eventDetails: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      eventDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      ipAddress: {
        type: Sequelize.STRING,
        allowNull: true
      },
      deviceType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      httpStatusCode: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_activity_logs');
  }
};
