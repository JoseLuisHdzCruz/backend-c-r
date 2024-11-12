const { DataTypes } = require("sequelize");
const sequelize = require("../src/config/database");
const Usuario = require("./usuarioModel");
const Question = require("./questionModel");

const Feedback = sequelize.define(
  "Feedback",
  {
    feedbackId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: "customerId",
      },
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Question,
        key: "questionId",
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "feedbacks",
    timestamps: false,
  }
);

Feedback.belongsTo(Usuario, { foreignKey: "customerId" });
Feedback.belongsTo(Question, { foreignKey: "questionId" });

module.exports = Feedback;
