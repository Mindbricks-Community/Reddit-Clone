module.exports = {
  AbuseServiceManager: require("./service-manager/AbuseServiceManager"),
  // main Database Crud Object Routes Manager Layer Classes
  // AbuseReport Db Object
  GetAbuseReportManager: require("./main/abuseReport/get-abusereport"),
  CreateAbuseReportManager: require("./main/abuseReport/create-abusereport"),
  UpdateAbuseReportManager: require("./main/abuseReport/update-abusereport"),
  DeleteAbuseReportManager: require("./main/abuseReport/delete-abusereport"),
  ListAbuseReportsManager: require("./main/abuseReport/list-abusereports"),
  // AbuseFlag Db Object
  GetAbuseFlagManager: require("./main/abuseFlag/get-abuseflag"),
  CreateAbuseFlagManager: require("./main/abuseFlag/create-abuseflag"),
  UpdateAbuseFlagManager: require("./main/abuseFlag/update-abuseflag"),
  DeleteAbuseFlagManager: require("./main/abuseFlag/delete-abuseflag"),
  ListAbuseFlagsManager: require("./main/abuseFlag/list-abuseflags"),
  // AbuseHeuristicTrigger Db Object
  GetAbuseHeuristicTriggerManager: require("./main/abuseHeuristicTrigger/get-abuseheuristictrigger"),
  CreateAbuseHeuristicTriggerManager: require("./main/abuseHeuristicTrigger/create-abuseheuristictrigger"),
  UpdateAbuseHeuristicTriggerManager: require("./main/abuseHeuristicTrigger/update-abuseheuristictrigger"),
  DeleteAbuseHeuristicTriggerManager: require("./main/abuseHeuristicTrigger/delete-abuseheuristictrigger"),
  ListAbuseHeuristicTriggersManager: require("./main/abuseHeuristicTrigger/list-abuseheuristictriggers"),
  // AbuseInvestigation Db Object
  GetAbuseInvestigationManager: require("./main/abuseInvestigation/get-abuseinvestigation"),
  CreateAbuseInvestigationManager: require("./main/abuseInvestigation/create-abuseinvestigation"),
  UpdateAbuseInvestigationManager: require("./main/abuseInvestigation/update-abuseinvestigation"),
  DeleteAbuseInvestigationManager: require("./main/abuseInvestigation/delete-abuseinvestigation"),
  ListAbuseInvestigationsManager: require("./main/abuseInvestigation/list-abuseinvestigations"),
};
