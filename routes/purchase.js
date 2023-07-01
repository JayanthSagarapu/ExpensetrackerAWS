const express = require("express");

const router = express.Router();

const purchaseController = require("../controllers/purchase");

const authenticationmiddleware = require("../middleware/auth");

router.get(
  "/premiummembership",
  authenticationmiddleware.authenticate,
  purchaseController.purchasePremium
);

router.post(
  "/updatetransactionstatus",
  authenticationmiddleware.authenticate,
  purchaseController.updateTransactionStatus
);

module.exports = router;
