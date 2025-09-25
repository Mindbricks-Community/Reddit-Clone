const mainRouters = require("./main");
const sessionRouter = require("./session-router");
module.exports = {
  ...mainRouters,
  LocalizationServiceRestController: require("./LocalizationServiceRestController"),
  ...sessionRouter,
};
