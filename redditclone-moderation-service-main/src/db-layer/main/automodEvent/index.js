const utils = require("./utils");

module.exports = {
  dbGetAutomodevent: require("./dbGetAutomodevent"),
  dbCreateAutomodevent: require("./dbCreateAutomodevent"),
  dbUpdateAutomodevent: require("./dbUpdateAutomodevent"),
  dbDeleteAutomodevent: require("./dbDeleteAutomodevent"),
  dbListAutomodevents: require("./dbListAutomodevents"),
  createAutomodEvent: utils.createAutomodEvent,
  getIdListOfAutomodEventByField: utils.getIdListOfAutomodEventByField,
  getAutomodEventById: utils.getAutomodEventById,
  getAutomodEventAggById: utils.getAutomodEventAggById,
  getAutomodEventListByQuery: utils.getAutomodEventListByQuery,
  getAutomodEventStatsByQuery: utils.getAutomodEventStatsByQuery,
  getAutomodEventByQuery: utils.getAutomodEventByQuery,
  updateAutomodEventById: utils.updateAutomodEventById,
  updateAutomodEventByIdList: utils.updateAutomodEventByIdList,
  updateAutomodEventByQuery: utils.updateAutomodEventByQuery,
  deleteAutomodEventById: utils.deleteAutomodEventById,
  deleteAutomodEventByQuery: utils.deleteAutomodEventByQuery,
};
