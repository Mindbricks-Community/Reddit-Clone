const utils = require("./utils");

module.exports = {
  dbGetMediaobject: require("./dbGetMediaobject"),
  dbCreateMediaobject: require("./dbCreateMediaobject"),
  dbUpdateMediaobject: require("./dbUpdateMediaobject"),
  dbDeleteMediaobject: require("./dbDeleteMediaobject"),
  dbListMediaobjects: require("./dbListMediaobjects"),
  createMediaObject: utils.createMediaObject,
  getIdListOfMediaObjectByField: utils.getIdListOfMediaObjectByField,
  getMediaObjectById: utils.getMediaObjectById,
  getMediaObjectAggById: utils.getMediaObjectAggById,
  getMediaObjectListByQuery: utils.getMediaObjectListByQuery,
  getMediaObjectStatsByQuery: utils.getMediaObjectStatsByQuery,
  getMediaObjectByQuery: utils.getMediaObjectByQuery,
  updateMediaObjectById: utils.updateMediaObjectById,
  updateMediaObjectByIdList: utils.updateMediaObjectByIdList,
  updateMediaObjectByQuery: utils.updateMediaObjectByQuery,
  deleteMediaObjectById: utils.deleteMediaObjectById,
  deleteMediaObjectByQuery: utils.deleteMediaObjectByQuery,
};
