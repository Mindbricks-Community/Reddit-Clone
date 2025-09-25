const AdminOpsServiceRestController = require("./AdminOpsServiceRestController");

module.exports = (name, routeName, req, res) => {
  const restController = new AdminOpsServiceRestController(
    name,
    routeName,
    req,
    res,
  );
  return restController;
};
