const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;

// const Sequelize = require("sequelize");

// const sequelize = require("../util/database");

// const Expense = sequelize.define("expense", {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//     allowNull: false,
//   },

//   amount: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//   },

//   description: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },

//   category: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

// module.exports = Expense;
