const utils = require("./utils");

module.exports = {
  createSloEvent: utils.createSloEvent,
  getIdListOfSloEventByField: utils.getIdListOfSloEventByField,
  getSloEventById: utils.getSloEventById,
  getSloEventAggById: utils.getSloEventAggById,
  getSloEventListByQuery: utils.getSloEventListByQuery,
  getSloEventStatsByQuery: utils.getSloEventStatsByQuery,
  getSloEventByQuery: utils.getSloEventByQuery,
  updateSloEventById: utils.updateSloEventById,
  updateSloEventByIdList: utils.updateSloEventByIdList,
  updateSloEventByQuery: utils.updateSloEventByQuery,
  deleteSloEventById: utils.deleteSloEventById,
  deleteSloEventByQuery: utils.deleteSloEventByQuery,
};
