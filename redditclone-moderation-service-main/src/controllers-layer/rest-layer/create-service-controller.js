const ModerationServiceRestController = require("./ModerationServiceRestController");

module.exports = (name, routeName, req, res) => {
  const restController = new ModerationServiceRestController(
    name,
    routeName,
    req,
    res,
  );
  return restController;
};
