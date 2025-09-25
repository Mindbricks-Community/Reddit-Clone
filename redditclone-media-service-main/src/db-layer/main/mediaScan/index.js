const utils = require("./utils");

module.exports = {
  dbGetMediascan: require("./dbGetMediascan"),
  dbCreateMediascan: require("./dbCreateMediascan"),
  dbUpdateMediascan: require("./dbUpdateMediascan"),
  dbDeleteMediascan: require("./dbDeleteMediascan"),
  dbListMediascans: require("./dbListMediascans"),
  createMediaScan: utils.createMediaScan,
  getIdListOfMediaScanByField: utils.getIdListOfMediaScanByField,
  getMediaScanById: utils.getMediaScanById,
  getMediaScanAggById: utils.getMediaScanAggById,
  getMediaScanListByQuery: utils.getMediaScanListByQuery,
  getMediaScanStatsByQuery: utils.getMediaScanStatsByQuery,
  getMediaScanByQuery: utils.getMediaScanByQuery,
  updateMediaScanById: utils.updateMediaScanById,
  updateMediaScanByIdList: utils.updateMediaScanByIdList,
  updateMediaScanByQuery: utils.updateMediaScanByQuery,
  deleteMediaScanById: utils.deleteMediaScanById,
  deleteMediaScanByQuery: utils.deleteMediaScanByQuery,
};
