const Razorpay = require("razorpay");
const Order = require("../models/purchase");
const controller = require("./controller");
const dotenv = require("dotenv");
dotenv.config();

exports.purchasePremium = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 2500;

    // rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
    //   // if (err) {
    //   //   throw new Error(JSON.stringify(err));
    //   // }
    //   req.user
    //     .createOrder({ orderid: order.id, status: "PENDING" })
    //     .then(() => {
    //       return res.status(201).json({ order, key_id: rzp.key_id });
    //     });
    //   // .catch((err) => {
    //   //   throw new Error(err);
    //   // });
    // });

    //mongoose
    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const newOrder = new Order({
        orderid: order.id,
        status: "PENDING",
        user: req.user.id,
      });
      await newOrder.save();
      return res.status(201).json({ order: newOrder, key_id: rzp.key_id });
    });
  } catch (err) {
    console.log(["purchase premium controller problem", err]);
    res
      .status(403)
      .json({ message: "purchase premium controller problem", error: err });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { payment_id, order_id } = req.body;

    // const order = await Order.findOne({ where: { orderid: order_id } });

    const order = await Order.findOne({ orderid: order_id }); //mongoose

    // console.log(order);

    // const promise1 = order.update({
    //   paymentid: payment_id,
    //   status: "SUCCESSFUL",
    // });
    // const promise2 = req.user.update({ ispremiumuser: true });

    let promise1, promise2;
    if (order) {
      order.paymentid = payment_id;
      order.status = "SUCCESSFUL";
      promise1 = order.save();

      req.user.ispremiumuser = true;
      promise2 = req.user.save();
    }

    Promise.all([promise1, promise2])
      .then(() => {
        return res.status(202).json({
          sucess: true,
          message: "Transaction Successful",
          token: controller.generateAccessToken(
            userId,
            undefined,
            req.user.ispremiumuser
          ),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (err) {
    console.log(["error in the razorpay controller", err]);
    res
      .status(403)
      .json({ error: err, message: "update Transaction controller problem" });
  }
};
