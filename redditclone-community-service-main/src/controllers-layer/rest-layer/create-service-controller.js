const CommunityServiceRestController = require("./CommunityServiceRestController");

module.exports = (name, routeName, req, res) => {
  const restController = new CommunityServiceRestController(
    name,
    routeName,
    req,
    res,
  );
  return restController;
};
