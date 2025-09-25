const mainRouters = require("./main");
const sessionRouter = require("./session-router");
module.exports = {
  ...mainRouters,
  AdminOpsServiceRestController: require("./AdminOpsServiceRestController"),
  ...sessionRouter,
};
