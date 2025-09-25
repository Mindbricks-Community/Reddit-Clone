module.exports = (headers) => {
  // main Database Crud Object Mcp Api Routers
  return {
    communityMcpRouter: require("./community")(headers),
    communityMemberMcpRouter: require("./communityMember")(headers),
    communityRuleMcpRouter: require("./communityRule")(headers),
    communityPinnedMcpRouter: require("./communityPinned")(headers),
    communityAutomodSettingMcpRouter: require("./communityAutomodSetting")(
      headers,
    ),
  };
};
