const utils = require("./utils");

module.exports = {
  dbGetAbuseheuristictrigger: require("./dbGetAbuseheuristictrigger"),
  dbCreateAbuseheuristictrigger: require("./dbCreateAbuseheuristictrigger"),
  dbUpdateAbuseheuristictrigger: require("./dbUpdateAbuseheuristictrigger"),
  dbDeleteAbuseheuristictrigger: require("./dbDeleteAbuseheuristictrigger"),
  dbListAbuseheuristictriggers: require("./dbListAbuseheuristictriggers"),
  createAbuseHeuristicTrigger: utils.createAbuseHeuristicTrigger,
  getIdListOfAbuseHeuristicTriggerByField:
    utils.getIdListOfAbuseHeuristicTriggerByField,
  getAbuseHeuristicTriggerById: utils.getAbuseHeuristicTriggerById,
  getAbuseHeuristicTriggerAggById: utils.getAbuseHeuristicTriggerAggById,
  getAbuseHeuristicTriggerListByQuery:
    utils.getAbuseHeuristicTriggerListByQuery,
  getAbuseHeuristicTriggerStatsByQuery:
    utils.getAbuseHeuristicTriggerStatsByQuery,
  getAbuseHeuristicTriggerByQuery: utils.getAbuseHeuristicTriggerByQuery,
  updateAbuseHeuristicTriggerById: utils.updateAbuseHeuristicTriggerById,
  updateAbuseHeuristicTriggerByIdList:
    utils.updateAbuseHeuristicTriggerByIdList,
  updateAbuseHeuristicTriggerByQuery: utils.updateAbuseHeuristicTriggerByQuery,
  deleteAbuseHeuristicTriggerById: utils.deleteAbuseHeuristicTriggerById,
  deleteAbuseHeuristicTriggerByQuery: utils.deleteAbuseHeuristicTriggerByQuery,
};
