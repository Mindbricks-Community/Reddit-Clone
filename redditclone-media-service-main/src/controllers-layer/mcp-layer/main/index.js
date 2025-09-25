module.exports = (headers) => {
  // main Database Crud Object Mcp Api Routers
  return {
    mediaObjectMcpRouter: require("./mediaObject")(headers),
    mediaScanMcpRouter: require("./mediaScan")(headers),
  };
};
