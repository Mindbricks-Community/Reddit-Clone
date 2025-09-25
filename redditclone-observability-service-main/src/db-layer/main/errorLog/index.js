const utils = require("./utils");

module.exports = {
  createErrorLog: utils.createErrorLog,
  getIdListOfErrorLogByField: utils.getIdListOfErrorLogByField,
  getErrorLogById: utils.getErrorLogById,
  getErrorLogAggById: utils.getErrorLogAggById,
  getErrorLogListByQuery: utils.getErrorLogListByQuery,
  getErrorLogStatsByQuery: utils.getErrorLogStatsByQuery,
  getErrorLogByQuery: utils.getErrorLogByQuery,
  updateErrorLogById: utils.updateErrorLogById,
  updateErrorLogByIdList: utils.updateErrorLogByIdList,
  updateErrorLogByQuery: utils.updateErrorLogByQuery,
  deleteErrorLogById: utils.deleteErrorLogById,
  deleteErrorLogByQuery: utils.deleteErrorLogByQuery,
};
