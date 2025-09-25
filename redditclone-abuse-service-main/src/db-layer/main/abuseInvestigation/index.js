const utils = require("./utils");

module.exports = {
  dbGetAbuseinvestigation: require("./dbGetAbuseinvestigation"),
  dbCreateAbuseinvestigation: require("./dbCreateAbuseinvestigation"),
  dbUpdateAbuseinvestigation: require("./dbUpdateAbuseinvestigation"),
  dbDeleteAbuseinvestigation: require("./dbDeleteAbuseinvestigation"),
  dbListAbuseinvestigations: require("./dbListAbuseinvestigations"),
  createAbuseInvestigation: utils.createAbuseInvestigation,
  getIdListOfAbuseInvestigationByField:
    utils.getIdListOfAbuseInvestigationByField,
  getAbuseInvestigationById: utils.getAbuseInvestigationById,
  getAbuseInvestigationAggById: utils.getAbuseInvestigationAggById,
  getAbuseInvestigationListByQuery: utils.getAbuseInvestigationListByQuery,
  getAbuseInvestigationStatsByQuery: utils.getAbuseInvestigationStatsByQuery,
  getAbuseInvestigationByQuery: utils.getAbuseInvestigationByQuery,
  updateAbuseInvestigationById: utils.updateAbuseInvestigationById,
  updateAbuseInvestigationByIdList: utils.updateAbuseInvestigationByIdList,
  updateAbuseInvestigationByQuery: utils.updateAbuseInvestigationByQuery,
  deleteAbuseInvestigationById: utils.deleteAbuseInvestigationById,
  deleteAbuseInvestigationByQuery: utils.deleteAbuseInvestigationByQuery,
};
