const express = require("express");
const router = express.Router();

const dynamicRoute = require("./dynamic.route.js");
router.use("/", dynamicRoute);

module.exports = router;
