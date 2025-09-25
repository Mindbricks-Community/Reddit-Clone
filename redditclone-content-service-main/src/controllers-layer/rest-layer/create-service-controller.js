const ContentServiceRestController = require("./ContentServiceRestController");

module.exports = (name, routeName, req, res) => {
  const restController = new ContentServiceRestController(
    name,
    routeName,
    req,
    res,
  );
  return restController;
};
