const mainFunctions = require("./main");

module.exports = {
  // main Database
  // AbuseReport Db Object
  dbGetAbusereport: mainFunctions.dbGetAbusereport,
  dbCreateAbusereport: mainFunctions.dbCreateAbusereport,
  dbUpdateAbusereport: mainFunctions.dbUpdateAbusereport,
  dbDeleteAbusereport: mainFunctions.dbDeleteAbusereport,
  dbListAbusereports: mainFunctions.dbListAbusereports,
  createAbuseReport: mainFunctions.createAbuseReport,
  getIdListOfAbuseReportByField: mainFunctions.getIdListOfAbuseReportByField,
  getAbuseReportById: mainFunctions.getAbuseReportById,
  getAbuseReportAggById: mainFunctions.getAbuseReportAggById,
  getAbuseReportListByQuery: mainFunctions.getAbuseReportListByQuery,
  getAbuseReportStatsByQuery: mainFunctions.getAbuseReportStatsByQuery,
  getAbuseReportByQuery: mainFunctions.getAbuseReportByQuery,
  updateAbuseReportById: mainFunctions.updateAbuseReportById,
  updateAbuseReportByIdList: mainFunctions.updateAbuseReportByIdList,
  updateAbuseReportByQuery: mainFunctions.updateAbuseReportByQuery,
  deleteAbuseReportById: mainFunctions.deleteAbuseReportById,
  deleteAbuseReportByQuery: mainFunctions.deleteAbuseReportByQuery,
  // AbuseFlag Db Object
  dbGetAbuseflag: mainFunctions.dbGetAbuseflag,
  dbCreateAbuseflag: mainFunctions.dbCreateAbuseflag,
  dbUpdateAbuseflag: mainFunctions.dbUpdateAbuseflag,
  dbDeleteAbuseflag: mainFunctions.dbDeleteAbuseflag,
  dbListAbuseflags: mainFunctions.dbListAbuseflags,
  createAbuseFlag: mainFunctions.createAbuseFlag,
  getIdListOfAbuseFlagByField: mainFunctions.getIdListOfAbuseFlagByField,
  getAbuseFlagById: mainFunctions.getAbuseFlagById,
  getAbuseFlagAggById: mainFunctions.getAbuseFlagAggById,
  getAbuseFlagListByQuery: mainFunctions.getAbuseFlagListByQuery,
  getAbuseFlagStatsByQuery: mainFunctions.getAbuseFlagStatsByQuery,
  getAbuseFlagByQuery: mainFunctions.getAbuseFlagByQuery,
  updateAbuseFlagById: mainFunctions.updateAbuseFlagById,
  updateAbuseFlagByIdList: mainFunctions.updateAbuseFlagByIdList,
  updateAbuseFlagByQuery: mainFunctions.updateAbuseFlagByQuery,
  deleteAbuseFlagById: mainFunctions.deleteAbuseFlagById,
  deleteAbuseFlagByQuery: mainFunctions.deleteAbuseFlagByQuery,
  // AbuseHeuristicTrigger Db Object
  dbGetAbuseheuristictrigger: mainFunctions.dbGetAbuseheuristictrigger,
  dbCreateAbuseheuristictrigger: mainFunctions.dbCreateAbuseheuristictrigger,
  dbUpdateAbuseheuristictrigger: mainFunctions.dbUpdateAbuseheuristictrigger,
  dbDeleteAbuseheuristictrigger: mainFunctions.dbDeleteAbuseheuristictrigger,
  dbListAbuseheuristictriggers: mainFunctions.dbListAbuseheuristictriggers,
  createAbuseHeuristicTrigger: mainFunctions.createAbuseHeuristicTrigger,
  getIdListOfAbuseHeuristicTriggerByField:
    mainFunctions.getIdListOfAbuseHeuristicTriggerByField,
  getAbuseHeuristicTriggerById: mainFunctions.getAbuseHeuristicTriggerById,
  getAbuseHeuristicTriggerAggById:
    mainFunctions.getAbuseHeuristicTriggerAggById,
  getAbuseHeuristicTriggerListByQuery:
    mainFunctions.getAbuseHeuristicTriggerListByQuery,
  getAbuseHeuristicTriggerStatsByQuery:
    mainFunctions.getAbuseHeuristicTriggerStatsByQuery,
  getAbuseHeuristicTriggerByQuery:
    mainFunctions.getAbuseHeuristicTriggerByQuery,
  updateAbuseHeuristicTriggerById:
    mainFunctions.updateAbuseHeuristicTriggerById,
  updateAbuseHeuristicTriggerByIdList:
    mainFunctions.updateAbuseHeuristicTriggerByIdList,
  updateAbuseHeuristicTriggerByQuery:
    mainFunctions.updateAbuseHeuristicTriggerByQuery,
  deleteAbuseHeuristicTriggerById:
    mainFunctions.deleteAbuseHeuristicTriggerById,
  deleteAbuseHeuristicTriggerByQuery:
    mainFunctions.deleteAbuseHeuristicTriggerByQuery,
  // AbuseInvestigation Db Object
  dbGetAbuseinvestigation: mainFunctions.dbGetAbuseinvestigation,
  dbCreateAbuseinvestigation: mainFunctions.dbCreateAbuseinvestigation,
  dbUpdateAbuseinvestigation: mainFunctions.dbUpdateAbuseinvestigation,
  dbDeleteAbuseinvestigation: mainFunctions.dbDeleteAbuseinvestigation,
  dbListAbuseinvestigations: mainFunctions.dbListAbuseinvestigations,
  createAbuseInvestigation: mainFunctions.createAbuseInvestigation,
  getIdListOfAbuseInvestigationByField:
    mainFunctions.getIdListOfAbuseInvestigationByField,
  getAbuseInvestigationById: mainFunctions.getAbuseInvestigationById,
  getAbuseInvestigationAggById: mainFunctions.getAbuseInvestigationAggById,
  getAbuseInvestigationListByQuery:
    mainFunctions.getAbuseInvestigationListByQuery,
  getAbuseInvestigationStatsByQuery:
    mainFunctions.getAbuseInvestigationStatsByQuery,
  getAbuseInvestigationByQuery: mainFunctions.getAbuseInvestigationByQuery,
  updateAbuseInvestigationById: mainFunctions.updateAbuseInvestigationById,
  updateAbuseInvestigationByIdList:
    mainFunctions.updateAbuseInvestigationByIdList,
  updateAbuseInvestigationByQuery:
    mainFunctions.updateAbuseInvestigationByQuery,
  deleteAbuseInvestigationById: mainFunctions.deleteAbuseInvestigationById,
  deleteAbuseInvestigationByQuery:
    mainFunctions.deleteAbuseInvestigationByQuery,
};
