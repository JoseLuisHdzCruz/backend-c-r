'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('historial_contraseñas', {
      contraseñasId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'customerId'
        }
      },
      contraseña: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fecha_cambio: {
        type: Sequelize.DATEONLY,
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('historial_contraseñas');
  }
};
