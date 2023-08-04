const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const forgetPasswordSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  isactive: {
    type: Boolean,
  },
  expiresby: {
    type: Date,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const Forgotpassword = mongoose.model("Password", forgetPasswordSchema);

module.exports = Forgotpassword;

// const Sequelize = require("sequelize");

// const sequelize = require("../util/database");

// const Forgotpassword = sequelize.define("forgotpassword", {
//   id: {
//     type: Sequelize.UUID,
//     primaryKey: true,
//     allowNull: false,
//   },
//   isactive: Sequelize.BOOLEAN,
//   expiresby: Sequelize.DATE,
// });

// module.exports = Forgotpassword;
