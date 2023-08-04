const User = require("../models/UserDb");

const getUserLeaderBoard = async (req, res) => {
  try {
    // const leaderboardDetails = await User.findAll({
    //   order: [["total_Expense", "DESC"]],
    // });

    const leaderboardDetails = await User.find({}).sort("-total_cost"); //mongoose

    res.status(200).json(leaderboardDetails);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = { getUserLeaderBoard };
