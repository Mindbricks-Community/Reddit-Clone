const mainRouters = require("./main");
const sessionRouter = require("./session-router");
module.exports = {
  ...mainRouters,
  CommunityServiceRestController: require("./CommunityServiceRestController"),
  ...sessionRouter,
};
