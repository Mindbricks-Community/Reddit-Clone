const AbuseServiceRestController = require("./AbuseServiceRestController");

module.exports = (name, routeName, req, res) => {
  const restController = new AbuseServiceRestController(
    name,
    routeName,
    req,
    res,
  );
  return restController;
};
