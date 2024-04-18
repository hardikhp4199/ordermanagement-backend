const express = require("express");
const router = express.Router();

router.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);
    if (username == "admin" && password == "Admin@123") {
      res.json({
        token: "orderManagement",
      });
    } else {
      res.json({ token: "" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;