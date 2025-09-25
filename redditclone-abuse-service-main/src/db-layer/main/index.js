const abuseReportFunctions = require("./abuseReport");
const abuseFlagFunctions = require("./abuseFlag");
const abuseHeuristicTriggerFunctions = require("./abuseHeuristicTrigger");
const abuseInvestigationFunctions = require("./abuseInvestigation");

module.exports = {
  // main Database
  // AbuseReport Db Object
  dbGetAbusereport: abuseReportFunctions.dbGetAbusereport,
  dbCreateAbusereport: abuseReportFunctions.dbCreateAbusereport,
  dbUpdateAbusereport: abuseReportFunctions.dbUpdateAbusereport,
  dbDeleteAbusereport: abuseReportFunctions.dbDeleteAbusereport,
  dbListAbusereports: abuseReportFunctions.dbListAbusereports,
  createAbuseReport: abuseReportFunctions.createAbuseReport,
  getIdListOfAbuseReportByField:
    abuseReportFunctions.getIdListOfAbuseReportByField,
  getAbuseReportById: abuseReportFunctions.getAbuseReportById,
  getAbuseReportAggById: abuseReportFunctions.getAbuseReportAggById,
  getAbuseReportListByQuery: abuseReportFunctions.getAbuseReportListByQuery,
  getAbuseReportStatsByQuery: abuseReportFunctions.getAbuseReportStatsByQuery,
  getAbuseReportByQuery: abuseReportFunctions.getAbuseReportByQuery,
  updateAbuseReportById: abuseReportFunctions.updateAbuseReportById,
  updateAbuseReportByIdList: abuseReportFunctions.updateAbuseReportByIdList,
  updateAbuseReportByQuery: abuseReportFunctions.updateAbuseReportByQuery,
  deleteAbuseReportById: abuseReportFunctions.deleteAbuseReportById,
  deleteAbuseReportByQuery: abuseReportFunctions.deleteAbuseReportByQuery,
  // AbuseFlag Db Object
  dbGetAbuseflag: abuseFlagFunctions.dbGetAbuseflag,
  dbCreateAbuseflag: abuseFlagFunctions.dbCreateAbuseflag,
  dbUpdateAbuseflag: abuseFlagFunctions.dbUpdateAbuseflag,
  dbDeleteAbuseflag: abuseFlagFunctions.dbDeleteAbuseflag,
  dbListAbuseflags: abuseFlagFunctions.dbListAbuseflags,
  createAbuseFlag: abuseFlagFunctions.createAbuseFlag,
  getIdListOfAbuseFlagByField: abuseFlagFunctions.getIdListOfAbuseFlagByField,
  getAbuseFlagById: abuseFlagFunctions.getAbuseFlagById,
  getAbuseFlagAggById: abuseFlagFunctions.getAbuseFlagAggById,
  getAbuseFlagListByQuery: abuseFlagFunctions.getAbuseFlagListByQuery,
  getAbuseFlagStatsByQuery: abuseFlagFunctions.getAbuseFlagStatsByQuery,
  getAbuseFlagByQuery: abuseFlagFunctions.getAbuseFlagByQuery,
  updateAbuseFlagById: abuseFlagFunctions.updateAbuseFlagById,
  updateAbuseFlagByIdList: abuseFlagFunctions.updateAbuseFlagByIdList,
  updateAbuseFlagByQuery: abuseFlagFunctions.updateAbuseFlagByQuery,
  deleteAbuseFlagById: abuseFlagFunctions.deleteAbuseFlagById,
  deleteAbuseFlagByQuery: abuseFlagFunctions.deleteAbuseFlagByQuery,
  // AbuseHeuristicTrigger Db Object
  dbGetAbuseheuristictrigger:
    abuseHeuristicTriggerFunctions.dbGetAbuseheuristictrigger,
  dbCreateAbuseheuristictrigger:
    abuseHeuristicTriggerFunctions.dbCreateAbuseheuristictrigger,
  dbUpdateAbuseheuristictrigger:
    abuseHeuristicTriggerFunctions.dbUpdateAbuseheuristictrigger,
  dbDeleteAbuseheuristictrigger:
    abuseHeuristicTriggerFunctions.dbDeleteAbuseheuristictrigger,
  dbListAbuseheuristictriggers:
    abuseHeuristicTriggerFunctions.dbListAbuseheuristictriggers,
  createAbuseHeuristicTrigger:
    abuseHeuristicTriggerFunctions.createAbuseHeuristicTrigger,
  getIdListOfAbuseHeuristicTriggerByField:
    abuseHeuristicTriggerFunctions.getIdListOfAbuseHeuristicTriggerByField,
  getAbuseHeuristicTriggerById:
    abuseHeuristicTriggerFunctions.getAbuseHeuristicTriggerById,
  getAbuseHeuristicTriggerAggById:
    abuseHeuristicTriggerFunctions.getAbuseHeuristicTriggerAggById,
  getAbuseHeuristicTriggerListByQuery:
    abuseHeuristicTriggerFunctions.getAbuseHeuristicTriggerListByQuery,
  getAbuseHeuristicTriggerStatsByQuery:
    abuseHeuristicTriggerFunctions.getAbuseHeuristicTriggerStatsByQuery,
  getAbuseHeuristicTriggerByQuery:
    abuseHeuristicTriggerFunctions.getAbuseHeuristicTriggerByQuery,
  updateAbuseHeuristicTriggerById:
    abuseHeuristicTriggerFunctions.updateAbuseHeuristicTriggerById,
  updateAbuseHeuristicTriggerByIdList:
    abuseHeuristicTriggerFunctions.updateAbuseHeuristicTriggerByIdList,
  updateAbuseHeuristicTriggerByQuery:
    abuseHeuristicTriggerFunctions.updateAbuseHeuristicTriggerByQuery,
  deleteAbuseHeuristicTriggerById:
    abuseHeuristicTriggerFunctions.deleteAbuseHeuristicTriggerById,
  deleteAbuseHeuristicTriggerByQuery:
    abuseHeuristicTriggerFunctions.deleteAbuseHeuristicTriggerByQuery,
  // AbuseInvestigation Db Object
  dbGetAbuseinvestigation: abuseInvestigationFunctions.dbGetAbuseinvestigation,
  dbCreateAbuseinvestigation:
    abuseInvestigationFunctions.dbCreateAbuseinvestigation,
  dbUpdateAbuseinvestigation:
    abuseInvestigationFunctions.dbUpdateAbuseinvestigation,
  dbDeleteAbuseinvestigation:
    abuseInvestigationFunctions.dbDeleteAbuseinvestigation,
  dbListAbuseinvestigations:
    abuseInvestigationFunctions.dbListAbuseinvestigations,
  createAbuseInvestigation:
    abuseInvestigationFunctions.createAbuseInvestigation,
  getIdListOfAbuseInvestigationByField:
    abuseInvestigationFunctions.getIdListOfAbuseInvestigationByField,
  getAbuseInvestigationById:
    abuseInvestigationFunctions.getAbuseInvestigationById,
  getAbuseInvestigationAggById:
    abuseInvestigationFunctions.getAbuseInvestigationAggById,
  getAbuseInvestigationListByQuery:
    abuseInvestigationFunctions.getAbuseInvestigationListByQuery,
  getAbuseInvestigationStatsByQuery:
    abuseInvestigationFunctions.getAbuseInvestigationStatsByQuery,
  getAbuseInvestigationByQuery:
    abuseInvestigationFunctions.getAbuseInvestigationByQuery,
  updateAbuseInvestigationById:
    abuseInvestigationFunctions.updateAbuseInvestigationById,
  updateAbuseInvestigationByIdList:
    abuseInvestigationFunctions.updateAbuseInvestigationByIdList,
  updateAbuseInvestigationByQuery:
    abuseInvestigationFunctions.updateAbuseInvestigationByQuery,
  deleteAbuseInvestigationById:
    abuseInvestigationFunctions.deleteAbuseInvestigationById,
  deleteAbuseInvestigationByQuery:
    abuseInvestigationFunctions.deleteAbuseInvestigationByQuery,
};
