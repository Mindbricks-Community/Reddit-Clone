module.exports = {
  // main Database Crud Object Rest Api Routers
  communityRouter: require("./community"),
  communityMemberRouter: require("./communityMember"),
  communityRuleRouter: require("./communityRule"),
  communityPinnedRouter: require("./communityPinned"),
  communityAutomodSettingRouter: require("./communityAutomodSetting"),
};
