const utils = require("./utils");

module.exports = {
  dbGetPolloption: require("./dbGetPolloption"),
  dbCreatePolloption: require("./dbCreatePolloption"),
  dbUpdatePolloption: require("./dbUpdatePolloption"),
  dbDeletePolloption: require("./dbDeletePolloption"),
  dbListPolloptions: require("./dbListPolloptions"),
  createPollOption: utils.createPollOption,
  getIdListOfPollOptionByField: utils.getIdListOfPollOptionByField,
  getPollOptionById: utils.getPollOptionById,
  getPollOptionAggById: utils.getPollOptionAggById,
  getPollOptionListByQuery: utils.getPollOptionListByQuery,
  getPollOptionStatsByQuery: utils.getPollOptionStatsByQuery,
  getPollOptionByQuery: utils.getPollOptionByQuery,
  updatePollOptionById: utils.updatePollOptionById,
  updatePollOptionByIdList: utils.updatePollOptionByIdList,
  updatePollOptionByQuery: utils.updatePollOptionByQuery,
  deletePollOptionById: utils.deletePollOptionById,
  deletePollOptionByQuery: utils.deletePollOptionByQuery,
};
