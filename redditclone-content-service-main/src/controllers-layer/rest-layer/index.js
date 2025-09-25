const mainRouters = require("./main");
const sessionRouter = require("./session-router");
module.exports = {
  ...mainRouters,
  ContentServiceRestController: require("./ContentServiceRestController"),
  ...sessionRouter,
};
