const mainMcpRouters = require("./main");
const sessionRouter = require("./session-router");
module.exports = (headers) => {
  return {
    ...mainMcpRouters(headers),
    AdminOpsServiceMcpController: require("./AdminOpsServiceMcpController"),
    ...sessionRouter,
  };
};
