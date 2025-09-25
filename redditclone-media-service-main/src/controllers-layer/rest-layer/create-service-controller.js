const MediaServiceRestController = require("./MediaServiceRestController");

module.exports = (name, routeName, req, res) => {
  const restController = new MediaServiceRestController(
    name,
    routeName,
    req,
    res,
  );
  return restController;
};
