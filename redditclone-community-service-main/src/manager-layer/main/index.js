module.exports = {
  // main Database Crud Object Routes Manager Layer Classes
  // Community Db Object
  GetCommunityManager: require("./community/get-community"),
  CreateCommunityManager: require("./community/create-community"),
  UpdateCommunityManager: require("./community/update-community"),
  DeleteCommunityManager: require("./community/delete-community"),
  ListCommunitiesManager: require("./community/list-communities"),
  // CommunityMember Db Object
  GetCommunityMemberManager: require("./communityMember/get-communitymember"),
  CreateCommunityMemberManager: require("./communityMember/create-communitymember"),
  UpdateCommunityMemberManager: require("./communityMember/update-communitymember"),
  DeleteCommunityMemberManager: require("./communityMember/delete-communitymember"),
  ListCommunityMembersManager: require("./communityMember/list-communitymembers"),
  // CommunityRule Db Object
  GetCommunityRuleManager: require("./communityRule/get-communityrule"),
  CreateCommunityRuleManager: require("./communityRule/create-communityrule"),
  UpdateCommunityRuleManager: require("./communityRule/update-communityrule"),
  DeleteCommunityRuleManager: require("./communityRule/delete-communityrule"),
  ListCommunityRulesManager: require("./communityRule/list-communityrules"),
  // CommunityPinned Db Object
  GetCommunityPinnedManager: require("./communityPinned/get-communitypinned"),
  CreateCommunityPinnedManager: require("./communityPinned/create-communitypinned"),
  UpdateCommunityPinnedManager: require("./communityPinned/update-communitypinned"),
  DeleteCommunityPinnedManager: require("./communityPinned/delete-communitypinned"),
  ListCommunityPinnedManager: require("./communityPinned/list-communitypinned"),
  // CommunityAutomodSetting Db Object
  GetCommunityAutomodSettingManager: require("./communityAutomodSetting/get-communityautomodsetting"),
  CreateCommunityAutomodSettingManager: require("./communityAutomodSetting/create-communityautomodsetting"),
  UpdateCommunityAutomodSettingManager: require("./communityAutomodSetting/update-communityautomodsetting"),
  DeleteCommunityAutomodSettingManager: require("./communityAutomodSetting/delete-communityautomodsetting"),
  ListCommunityAutomodSettingsManager: require("./communityAutomodSetting/list-communityautomodsettings"),
};
