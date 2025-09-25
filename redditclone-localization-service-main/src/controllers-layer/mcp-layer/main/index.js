module.exports = (headers) => {
  // main Database Crud Object Mcp Api Routers
  return {
    localeMcpRouter: require("./locale")(headers),
    localizationKeyMcpRouter: require("./localizationKey")(headers),
    localizationStringMcpRouter: require("./localizationString")(headers),
  };
};
