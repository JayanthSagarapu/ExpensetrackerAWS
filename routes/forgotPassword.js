const express = require("express");

const router = express.Router();

const forgetPasswordController = require("../controllers/forgotPassword");

router.get(
  "/updatepassword/:resetpasswordid",
  forgetPasswordController.updatepassword
);

router.get("/resetpassword/:id", forgetPasswordController.resetpassword);

// ? router.use pr delete, post, get, put kuchh bhi laga sakte. hum post kr rhe
router.use("/forgotpassword", forgetPasswordController.forgotpassword);

module.exports = router;
