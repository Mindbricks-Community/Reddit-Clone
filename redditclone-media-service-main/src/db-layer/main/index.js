const mediaObjectFunctions = require("./mediaObject");
const mediaScanFunctions = require("./mediaScan");

module.exports = {
  // main Database
  // MediaObject Db Object
  dbGetMediaobject: mediaObjectFunctions.dbGetMediaobject,
  dbCreateMediaobject: mediaObjectFunctions.dbCreateMediaobject,
  dbUpdateMediaobject: mediaObjectFunctions.dbUpdateMediaobject,
  dbDeleteMediaobject: mediaObjectFunctions.dbDeleteMediaobject,
  dbListMediaobjects: mediaObjectFunctions.dbListMediaobjects,
  createMediaObject: mediaObjectFunctions.createMediaObject,
  getIdListOfMediaObjectByField:
    mediaObjectFunctions.getIdListOfMediaObjectByField,
  getMediaObjectById: mediaObjectFunctions.getMediaObjectById,
  getMediaObjectAggById: mediaObjectFunctions.getMediaObjectAggById,
  getMediaObjectListByQuery: mediaObjectFunctions.getMediaObjectListByQuery,
  getMediaObjectStatsByQuery: mediaObjectFunctions.getMediaObjectStatsByQuery,
  getMediaObjectByQuery: mediaObjectFunctions.getMediaObjectByQuery,
  updateMediaObjectById: mediaObjectFunctions.updateMediaObjectById,
  updateMediaObjectByIdList: mediaObjectFunctions.updateMediaObjectByIdList,
  updateMediaObjectByQuery: mediaObjectFunctions.updateMediaObjectByQuery,
  deleteMediaObjectById: mediaObjectFunctions.deleteMediaObjectById,
  deleteMediaObjectByQuery: mediaObjectFunctions.deleteMediaObjectByQuery,
  // MediaScan Db Object
  dbGetMediascan: mediaScanFunctions.dbGetMediascan,
  dbCreateMediascan: mediaScanFunctions.dbCreateMediascan,
  dbUpdateMediascan: mediaScanFunctions.dbUpdateMediascan,
  dbDeleteMediascan: mediaScanFunctions.dbDeleteMediascan,
  dbListMediascans: mediaScanFunctions.dbListMediascans,
  createMediaScan: mediaScanFunctions.createMediaScan,
  getIdListOfMediaScanByField: mediaScanFunctions.getIdListOfMediaScanByField,
  getMediaScanById: mediaScanFunctions.getMediaScanById,
  getMediaScanAggById: mediaScanFunctions.getMediaScanAggById,
  getMediaScanListByQuery: mediaScanFunctions.getMediaScanListByQuery,
  getMediaScanStatsByQuery: mediaScanFunctions.getMediaScanStatsByQuery,
  getMediaScanByQuery: mediaScanFunctions.getMediaScanByQuery,
  updateMediaScanById: mediaScanFunctions.updateMediaScanById,
  updateMediaScanByIdList: mediaScanFunctions.updateMediaScanByIdList,
  updateMediaScanByQuery: mediaScanFunctions.updateMediaScanByQuery,
  deleteMediaScanById: mediaScanFunctions.deleteMediaScanById,
  deleteMediaScanByQuery: mediaScanFunctions.deleteMediaScanByQuery,
};
