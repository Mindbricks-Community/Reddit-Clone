const LocalizationServiceRestController = require("./LocalizationServiceRestController");

module.exports = (name, routeName, req, res) => {
  const restController = new LocalizationServiceRestController(
    name,
    routeName,
    req,
    res,
  );
  return restController;
};
