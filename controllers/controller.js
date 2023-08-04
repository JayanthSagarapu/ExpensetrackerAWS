const User = require("../models/UserDb");
const Expense = require("../models/expense");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const sequelize = require("../util/database");
const mongoose = require("mongoose");
const S3service = require("../services/S3services");

const addUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const saltrounds = 10;
    bcrypt.hash(password, saltrounds, async (err, hash) => {
      // await User.create({
      //   username: username,
      //   email: email,
      //   password: hash,
      //   ispremiumuser: false,
      // });

      //mongoose
      const user = new User({
        username,
        email,
        password: hash,
        ispremiumuser: false,
      });

      await user.save(); //mongoose

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
    { _id: id, username: username, ispremiumuser },
    process.env.TOKEN_SECRET
  );
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // const founduser = await User.findOne({ where: { email } });
    const founduser = await User.findOne({ email }); //mongoose

    if (founduser) {
      bcrypt.compare(password, founduser.password, (err, result) => {
        if (result) {
          res.status(200).json({
            success: true,
            message: "Successfully Logged In",
            token: generateAccessToken(
              founduser._id,
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
    const expenses = await Expense.find({ user: req.user.id });
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
  const session = await mongoose.startSession(); //mongoose
  try {
    // const t = await sequelize.transaction();
    session.startTransaction(); //mongoose

    const { amount, description, category } = req.body;

    // const expense = await Expense.create(
    //   {
    //     amount,
    //     description,
    //     category,
    //     user: req.user._id,
    //   },
    //   // { transaction: t }
    // );

    const expense = new Expense(
      {
        amount,
        description,
        category,
        user: req.user._id,
      },
      { session }
    );

    await expense.save(); //mongoose

    const total_Expense = req.user.total_Expense + Number(amount);
    // const update = { total_Expense: total_Expense };

    // await User.update(
    //   { total_Expense: total_Expense },
    //   { where: { id: req.user.id }, transaction: t }
    // );

    // mongoose
    const updateuser = await User.findByIdAndUpdate(
      req.user._id,
      { total_Expense: total_Expense },
      { session }
    );

    // await t.commit();
    await session.commitTransaction(); //mongoose
    res.send(expense);
  } catch (err) {
    // await t.rollback();
    await session.abortTransaction(); //mongoose
    res.status(500).json(err);
  }
};

const getExpenses = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 5;
    const offset = (page - 1) * limit;

    // const response = await Expense.findAndCountAll({
    //   where: { userId: req.user.id },
    //   offset: offset,
    //   limit: limit,
    // });
    // let totalItems = response.count;

    const count = await Expense.countDocuments({ user: req.user.id }); // mongoose

    const expenses = await Expense.find({ user: req.user.id }) // mongoose
      .skip(offset)
      .limit(limit);

    let totalItems = count;

    res.json({
      // expenses: response.rows,
      expenses: expenses, // mongoose
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
  // const t = await sequelize.transaction();
  const session = await mongoose.startSession(); // mongoose
  session.startTransaction();
  try {
    const { _id } = req.params;

    // const expense = await Expense.findOne({
    //   where: { id: expenseId, userId: req.user.id },
    //   transaction: t,
    // });

    //mongoose
    const expense = await Expense.findOneAndRemove({
      _id: _id,
    }).session(session);

    // if (expense) {
    //   // await expense.destroy();
    //   await expense.deleteOne(); //mongoose

    const total_Expense = req.user.total_Expense - Number(expense.amount);

    // await User.update(
    //   {
    //     total_Expense: total_Expense,
    //     transaction: t,
    //   },
    //   {
    //     where: { id: req.user.id },
    //     transaction: t,
    //   }
    // );

    // await t.commit();

    //mongoose
    const updateuser = await User.findByIdAndUpdate(
      req.user._id,
      { total_Expense: total_Expense },
      { session }
    );

    await session.commitTransaction(); //mongoose
    session.endSession(); //mongoose

    res.status(200).json({
      message: "Successfully deleted Expense",
    });
  } catch (err) {
    // await t.rollback();
    await session.abortTransaction(); //mongoose
    session.endSession();
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
