module.exports = {
  CommunityServiceManager: require("./service-manager/CommunityServiceManager"),
  // main Database Crud Object Routes Manager Layer Classes
  // Community Db Object
  GetCommunityManager: require("./main/community/get-community"),
  CreateCommunityManager: require("./main/community/create-community"),
  UpdateCommunityManager: require("./main/community/update-community"),
  DeleteCommunityManager: require("./main/community/delete-community"),
  ListCommunitiesManager: require("./main/community/list-communities"),
  // CommunityMember Db Object
  GetCommunityMemberManager: require("./main/communityMember/get-communitymember"),
  CreateCommunityMemberManager: require("./main/communityMember/create-communitymember"),
  UpdateCommunityMemberManager: require("./main/communityMember/update-communitymember"),
  DeleteCommunityMemberManager: require("./main/communityMember/delete-communitymember"),
  ListCommunityMembersManager: require("./main/communityMember/list-communitymembers"),
  // CommunityRule Db Object
  GetCommunityRuleManager: require("./main/communityRule/get-communityrule"),
  CreateCommunityRuleManager: require("./main/communityRule/create-communityrule"),
  UpdateCommunityRuleManager: require("./main/communityRule/update-communityrule"),
  DeleteCommunityRuleManager: require("./main/communityRule/delete-communityrule"),
  ListCommunityRulesManager: require("./main/communityRule/list-communityrules"),
  // CommunityPinned Db Object
  GetCommunityPinnedManager: require("./main/communityPinned/get-communitypinned"),
  CreateCommunityPinnedManager: require("./main/communityPinned/create-communitypinned"),
  UpdateCommunityPinnedManager: require("./main/communityPinned/update-communitypinned"),
  DeleteCommunityPinnedManager: require("./main/communityPinned/delete-communitypinned"),
  ListCommunityPinnedManager: require("./main/communityPinned/list-communitypinned"),
  // CommunityAutomodSetting Db Object
  GetCommunityAutomodSettingManager: require("./main/communityAutomodSetting/get-communityautomodsetting"),
  CreateCommunityAutomodSettingManager: require("./main/communityAutomodSetting/create-communityautomodsetting"),
  UpdateCommunityAutomodSettingManager: require("./main/communityAutomodSetting/update-communityautomodsetting"),
  DeleteCommunityAutomodSettingManager: require("./main/communityAutomodSetting/delete-communityautomodsetting"),
  ListCommunityAutomodSettingsManager: require("./main/communityAutomodSetting/list-communityautomodsettings"),
};
