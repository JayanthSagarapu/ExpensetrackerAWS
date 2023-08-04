const path = require("path");
const fs = require("fs");

const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const purchaseRoutes = require("./routes/purchase");
const premiumUserRoutes = require("./routes/premiumUser");
const forgetPasswordRoutes = require("./routes/forgotPassword");

// const sequelize = require("./util/database");

const User = require("./models/UserDb");
const Expense = require("./models/expense");
const Order = require("./models/purchase");
const Forgotpassword = require("./models/forgotPassword");

// app.use(helmet());

// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "access.log"),
//   { flags: "a" }
// );

// app.use(morgan("combined", { stream: accessLogStream }));

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumUserRoutes);
app.use("/password", forgetPasswordRoutes);

app.use((req, res) => {
  console.log("url", req.url);
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          username: "Jay",
          email: "jay@gmail.com",
          password: "1234",
          total_Expense: "0",
        });
        user.save();
      }
    });
    const port = process.env.PORT || 4000;
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });

// User.hasMany(Expense);
// Expense.belongsTo(User);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(Forgotpassword);
// Forgotpassword.belongsTo(User);

// const port = process.env.PORT || 4000;

// sequelize
//   .sync()
//   .then(() => {
//     app.listen(port);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
