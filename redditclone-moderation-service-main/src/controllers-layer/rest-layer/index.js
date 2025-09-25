const mainRouters = require("./main");
const sessionRouter = require("./session-router");
module.exports = {
  ...mainRouters,
  ModerationServiceRestController: require("./ModerationServiceRestController"),
  ...sessionRouter,
};
