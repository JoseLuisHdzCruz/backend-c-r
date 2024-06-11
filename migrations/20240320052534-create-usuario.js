'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('usuarios', {
      customerId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      aPaterno: {
        type: Sequelize.STRING,
        allowNull: false
      },
      aMaterno: {
        type: Sequelize.STRING,
        allowNull: false
      },
      correo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      telefono: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sexo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      imagen: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fecha_nacimiento: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      contraseña: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ultimoAcceso: {
        type: Sequelize.DATE,
        allowNull: true
      },
      statusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'status',
          key: 'statusId'
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
      intentosFallidos: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      ultimoIntentoFallido: {
        type: Sequelize.DATE,
        allowNull: true
      },
      preguntaSecreta: {
        type: Sequelize.STRING,
        allowNull: false
      },
      respuestaPSecreta: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fcmToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('usuarios');
  }
};
