'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('empleados', {
      empleadoId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      apPaterno: {
        type: Sequelize.STRING,
        allowNull: false
      },
      apMaterno: {
        type: Sequelize.STRING,
        allowNull: false
      },
      statusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'status',
          key: 'statusId'
        }
      },
      Telefono: {
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
      NumInterior: {
        type: Sequelize.STRING,
        allowNull: true
      },
      NumExterior: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Referencias: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      correo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      contraseña: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('empleados');
  }
};
