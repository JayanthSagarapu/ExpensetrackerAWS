const User = require("../models/UserDb");
const bcrypt = require("bcrypt");
const Expense = require("../models/expense");
const jwt = require("jsonwebtoken");
const sequelize = require("../util/database");
const S3service = require("../services/S3services");

const addUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const saltrounds = 10;
    bcrypt.hash(password, saltrounds, async (err, hash) => {
      await User.create({
        username: username,
        email: email,
        password: hash,
        ispremiumuser: false,
      });
      res.status(200).json({
        message: "Successfully Created new User",
      });
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const generateAccessToken = (id, username, ispremiumuser) => {
  return jwt.sign(
    { userId: id, username: username, ispremiumuser },
    process.env.TOKEN_SECRET
  );
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const founduser = await User.findOne({ where: { email } });
    if (founduser) {
      bcrypt.compare(password, founduser.password, (err, result) => {
        if (result) {
          res.status(200).json({
            success: true,
            message: "Successfully Logged In",
            token: generateAccessToken(
              founduser.id,
              founduser.username,
              founduser.ispremiumuser
            ),
          });
        } else {
          res
            .status(401)
            .json({ success: false, message: "Password is wrong" });
        }
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: "User not found in table" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const downloadExpense = async (req, res) => {
  try {
    const expenses = await req.user.getExpenses();
    // console.log(expenses);
    const stringifiedExpenses = JSON.stringify(expenses);

    const userId = req.user.id;
    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileURl = await S3service.uploadToS3(stringifiedExpenses, filename);
    res.status(200).json({ fileURl, success: true });
  } catch (err) {
    res.status(500).json({ fileURl: "", success: false, err: err });
    console.log(err);
  }
};

const createExpense = async (req, res) => {
  try {
    const t = await sequelize.transaction();
    const { amount, description, category } = req.body;

    const expense = await Expense.create(
      {
        amount: amount,
        description: description,
        category: category,
        userId: req.user.id,
      },
      { transaction: t }
    );

    const total_Expense = Number(req.user.total_Expense) + Number(amount);
    await User.update(
      { total_Expense: total_Expense },
      { where: { id: req.user.id }, transaction: t }
    );
    await t.commit();
    res.send(expense);
  } catch (err) {
    await t.rollback();
    res.status(500).json(err);
  }
};

const getExpenses = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 5;

    const response = await Expense.findAndCountAll({
      where: { userId: req.user.id },
      offset: (page - 1) * limit,
      limit: limit,
    });
    let totalItems = response.count;
    res.json({
      expenses: response.rows,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      totalItems: totalItems,
      hasNextPage: limit * page < totalItems,
      nextPage: page + 1,
      hasPrevPage: page > 1,
      prevPage: page - 1,
      lastPage: Math.ceil(totalItems / limit),
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const expenseId = req.params.id;

    const expense = await Expense.findOne({
      where: { id: expenseId, userId: req.user.id },
      transaction: t,
    });

    if (expense) {
      await expense.destroy();
      const total_Expense =
        Number(req.user.total_Expense) - Number(expense.amount);

      await User.update(
        {
          total_Expense: total_Expense,
          transaction: t,
        },
        {
          where: { id: req.user.id },
          transaction: t,
        }
      );

      await t.commit();

      res.status(200).json({
        message: "Successfully deleted Expense",
      });
    }
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "Delete Expense problem" });
  }
};

module.exports = {
  addUser,
  loginUser,
  createExpense,
  getExpenses,
  deleteExpense,
  generateAccessToken,
  downloadExpense,
};
