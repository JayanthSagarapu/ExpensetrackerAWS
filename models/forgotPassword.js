const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Forgotpassword = sequelize.define("forgotpassword", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
  },
  isactive: Sequelize.BOOLEAN,
  expiresby: Sequelize.DATE,
});

module.exports = Forgotpassword;
