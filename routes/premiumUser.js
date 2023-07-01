const express = require("express");

const router = express.Router();

const premiumUserController = require("../controllers/premiumUser");

const authenticationmiddleware = require("../middleware/auth");

router.get(
  "/showleaderBoard",
  authenticationmiddleware.authenticate,
  premiumUserController.getUserLeaderBoard
);

module.exports = router;
