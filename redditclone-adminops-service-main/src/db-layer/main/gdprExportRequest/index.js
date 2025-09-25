const utils = require("./utils");

module.exports = {
  dbGetGdprexportrequest: require("./dbGetGdprexportrequest"),
  dbCreateGdprexportrequest: require("./dbCreateGdprexportrequest"),
  dbUpdateGdprexportrequest: require("./dbUpdateGdprexportrequest"),
  dbDeleteGdprexportrequest: require("./dbDeleteGdprexportrequest"),
  dbListGdprexportrequests: require("./dbListGdprexportrequests"),
  createGdprExportRequest: utils.createGdprExportRequest,
  getIdListOfGdprExportRequestByField:
    utils.getIdListOfGdprExportRequestByField,
  getGdprExportRequestById: utils.getGdprExportRequestById,
  getGdprExportRequestAggById: utils.getGdprExportRequestAggById,
  getGdprExportRequestListByQuery: utils.getGdprExportRequestListByQuery,
  getGdprExportRequestStatsByQuery: utils.getGdprExportRequestStatsByQuery,
  getGdprExportRequestByQuery: utils.getGdprExportRequestByQuery,
  updateGdprExportRequestById: utils.updateGdprExportRequestById,
  updateGdprExportRequestByIdList: utils.updateGdprExportRequestByIdList,
  updateGdprExportRequestByQuery: utils.updateGdprExportRequestByQuery,
  deleteGdprExportRequestById: utils.deleteGdprExportRequestById,
  deleteGdprExportRequestByQuery: utils.deleteGdprExportRequestByQuery,
};
