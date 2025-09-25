module.exports = {
  // main Database Crud Object Routes Manager Layer Classes
  // AbuseReport Db Object
  GetAbuseReportManager: require("./abuseReport/get-abusereport"),
  CreateAbuseReportManager: require("./abuseReport/create-abusereport"),
  UpdateAbuseReportManager: require("./abuseReport/update-abusereport"),
  DeleteAbuseReportManager: require("./abuseReport/delete-abusereport"),
  ListAbuseReportsManager: require("./abuseReport/list-abusereports"),
  // AbuseFlag Db Object
  GetAbuseFlagManager: require("./abuseFlag/get-abuseflag"),
  CreateAbuseFlagManager: require("./abuseFlag/create-abuseflag"),
  UpdateAbuseFlagManager: require("./abuseFlag/update-abuseflag"),
  DeleteAbuseFlagManager: require("./abuseFlag/delete-abuseflag"),
  ListAbuseFlagsManager: require("./abuseFlag/list-abuseflags"),
  // AbuseHeuristicTrigger Db Object
  GetAbuseHeuristicTriggerManager: require("./abuseHeuristicTrigger/get-abuseheuristictrigger"),
  CreateAbuseHeuristicTriggerManager: require("./abuseHeuristicTrigger/create-abuseheuristictrigger"),
  UpdateAbuseHeuristicTriggerManager: require("./abuseHeuristicTrigger/update-abuseheuristictrigger"),
  DeleteAbuseHeuristicTriggerManager: require("./abuseHeuristicTrigger/delete-abuseheuristictrigger"),
  ListAbuseHeuristicTriggersManager: require("./abuseHeuristicTrigger/list-abuseheuristictriggers"),
  // AbuseInvestigation Db Object
  GetAbuseInvestigationManager: require("./abuseInvestigation/get-abuseinvestigation"),
  CreateAbuseInvestigationManager: require("./abuseInvestigation/create-abuseinvestigation"),
  UpdateAbuseInvestigationManager: require("./abuseInvestigation/update-abuseinvestigation"),
  DeleteAbuseInvestigationManager: require("./abuseInvestigation/delete-abuseinvestigation"),
  ListAbuseInvestigationsManager: require("./abuseInvestigation/list-abuseinvestigations"),
};
