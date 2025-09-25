const utils = require("./utils");

module.exports = {
  dbGetModmailmessage: require("./dbGetModmailmessage"),
  dbCreateModmailmessage: require("./dbCreateModmailmessage"),
  dbUpdateModmailmessage: require("./dbUpdateModmailmessage"),
  dbDeleteModmailmessage: require("./dbDeleteModmailmessage"),
  dbListModmailmessages: require("./dbListModmailmessages"),
  createModmailMessage: utils.createModmailMessage,
  getIdListOfModmailMessageByField: utils.getIdListOfModmailMessageByField,
  getModmailMessageById: utils.getModmailMessageById,
  getModmailMessageAggById: utils.getModmailMessageAggById,
  getModmailMessageListByQuery: utils.getModmailMessageListByQuery,
  getModmailMessageStatsByQuery: utils.getModmailMessageStatsByQuery,
  getModmailMessageByQuery: utils.getModmailMessageByQuery,
  updateModmailMessageById: utils.updateModmailMessageById,
  updateModmailMessageByIdList: utils.updateModmailMessageByIdList,
  updateModmailMessageByQuery: utils.updateModmailMessageByQuery,
  deleteModmailMessageById: utils.deleteModmailMessageById,
  deleteModmailMessageByQuery: utils.deleteModmailMessageByQuery,
};
