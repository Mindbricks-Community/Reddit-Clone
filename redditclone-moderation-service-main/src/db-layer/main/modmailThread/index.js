const utils = require("./utils");

module.exports = {
  dbGetModmailthread: require("./dbGetModmailthread"),
  dbCreateModmailthread: require("./dbCreateModmailthread"),
  dbUpdateModmailthread: require("./dbUpdateModmailthread"),
  dbDeleteModmailthread: require("./dbDeleteModmailthread"),
  dbListModmailthreads: require("./dbListModmailthreads"),
  createModmailThread: utils.createModmailThread,
  getIdListOfModmailThreadByField: utils.getIdListOfModmailThreadByField,
  getModmailThreadById: utils.getModmailThreadById,
  getModmailThreadAggById: utils.getModmailThreadAggById,
  getModmailThreadListByQuery: utils.getModmailThreadListByQuery,
  getModmailThreadStatsByQuery: utils.getModmailThreadStatsByQuery,
  getModmailThreadByQuery: utils.getModmailThreadByQuery,
  updateModmailThreadById: utils.updateModmailThreadById,
  updateModmailThreadByIdList: utils.updateModmailThreadByIdList,
  updateModmailThreadByQuery: utils.updateModmailThreadByQuery,
  deleteModmailThreadById: utils.deleteModmailThreadById,
  deleteModmailThreadByQuery: utils.deleteModmailThreadByQuery,
};
