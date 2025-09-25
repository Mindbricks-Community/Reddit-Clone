module.exports = (headers) => {
  // main Database Crud Object Mcp Api Routers
  return {
    postMcpRouter: require("./post")(headers),
    commentMcpRouter: require("./comment")(headers),
    voteMcpRouter: require("./vote")(headers),
    pollOptionMcpRouter: require("./pollOption")(headers),
    postMediaMcpRouter: require("./postMedia")(headers),
  };
};
