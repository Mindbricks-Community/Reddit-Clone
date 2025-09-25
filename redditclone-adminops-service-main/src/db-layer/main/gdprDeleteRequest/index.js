const utils = require("./utils");

module.exports = {
  dbGetGdprdeleterequest: require("./dbGetGdprdeleterequest"),
  dbCreateGdprdeleterequest: require("./dbCreateGdprdeleterequest"),
  dbUpdateGdprdeleterequest: require("./dbUpdateGdprdeleterequest"),
  dbDeleteGdprdeleterequest: require("./dbDeleteGdprdeleterequest"),
  dbListGdprdeleterequests: require("./dbListGdprdeleterequests"),
  createGdprDeleteRequest: utils.createGdprDeleteRequest,
  getIdListOfGdprDeleteRequestByField:
    utils.getIdListOfGdprDeleteRequestByField,
  getGdprDeleteRequestById: utils.getGdprDeleteRequestById,
  getGdprDeleteRequestAggById: utils.getGdprDeleteRequestAggById,
  getGdprDeleteRequestListByQuery: utils.getGdprDeleteRequestListByQuery,
  getGdprDeleteRequestStatsByQuery: utils.getGdprDeleteRequestStatsByQuery,
  getGdprDeleteRequestByQuery: utils.getGdprDeleteRequestByQuery,
  updateGdprDeleteRequestById: utils.updateGdprDeleteRequestById,
  updateGdprDeleteRequestByIdList: utils.updateGdprDeleteRequestByIdList,
  updateGdprDeleteRequestByQuery: utils.updateGdprDeleteRequestByQuery,
  deleteGdprDeleteRequestById: utils.deleteGdprDeleteRequestById,
  deleteGdprDeleteRequestByQuery: utils.deleteGdprDeleteRequestByQuery,
};
