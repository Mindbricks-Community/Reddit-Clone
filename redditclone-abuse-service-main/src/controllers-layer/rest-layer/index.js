const mainRouters = require("./main");
const sessionRouter = require("./session-router");
module.exports = {
  ...mainRouters,
  AbuseServiceRestController: require("./AbuseServiceRestController"),
  ...sessionRouter,
};
