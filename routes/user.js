const express = require("express");
const router = express.Router();

const userAuthentication = require("../middleware/auth");

const userController = require("../controllers/controller");

router.post("/user/signup", userController.addUser);

router.post("/user/login", userController.loginUser);

router.get(
  "/user/download",
  userAuthentication.authenticate,
  userController.downloadExpense
);

router.post(
  "/expenses/createExpense",
  userAuthentication.authenticate,
  userController.createExpense
);

router.get(
  "/getExpenses",
  userAuthentication.authenticate,
  userController.getExpenses
);

router.delete(
  "/deleteExpense/:id",
  userAuthentication.authenticate,
  userController.deleteExpense
);

module.exports = router;
