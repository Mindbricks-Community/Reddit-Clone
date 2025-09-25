const mainRouters = require("./main");
const sessionRouter = require("./session-router");
module.exports = {
  ...mainRouters,
  MediaServiceRestController: require("./MediaServiceRestController"),
  ...sessionRouter,
};
