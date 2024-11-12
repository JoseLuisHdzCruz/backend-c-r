const { DataTypes } = require("sequelize");
const sequelize = require("../src/config/database");

const Question = sequelize.define(
  "Question",
  {
    questionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "questions",
    timestamps: false,
  }
);

(async () => {
  await Question.sync();
})();

module.exports = Question;
