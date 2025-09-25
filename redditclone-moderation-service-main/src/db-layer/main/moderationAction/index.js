const utils = require("./utils");

module.exports = {
  dbGetModerationaction: require("./dbGetModerationaction"),
  dbCreateModerationaction: require("./dbCreateModerationaction"),
  dbUpdateModerationaction: require("./dbUpdateModerationaction"),
  dbDeleteModerationaction: require("./dbDeleteModerationaction"),
  dbListModerationactions: require("./dbListModerationactions"),
  createModerationAction: utils.createModerationAction,
  getIdListOfModerationActionByField: utils.getIdListOfModerationActionByField,
  getModerationActionById: utils.getModerationActionById,
  getModerationActionAggById: utils.getModerationActionAggById,
  getModerationActionListByQuery: utils.getModerationActionListByQuery,
  getModerationActionStatsByQuery: utils.getModerationActionStatsByQuery,
  getModerationActionByQuery: utils.getModerationActionByQuery,
  updateModerationActionById: utils.updateModerationActionById,
  updateModerationActionByIdList: utils.updateModerationActionByIdList,
  updateModerationActionByQuery: utils.updateModerationActionByQuery,
  deleteModerationActionById: utils.deleteModerationActionById,
  deleteModerationActionByQuery: utils.deleteModerationActionByQuery,
};
