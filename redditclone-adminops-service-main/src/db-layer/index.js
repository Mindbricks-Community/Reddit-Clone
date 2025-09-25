const mainFunctions = require("./main");

module.exports = {
  // main Database
  // AdminUserAction Db Object
  dbGetAdminuseraction: mainFunctions.dbGetAdminuseraction,
  dbCreateAdminuseraction: mainFunctions.dbCreateAdminuseraction,
  dbUpdateAdminuseraction: mainFunctions.dbUpdateAdminuseraction,
  dbDeleteAdminuseraction: mainFunctions.dbDeleteAdminuseraction,
  dbListAdminuseractions: mainFunctions.dbListAdminuseractions,
  createAdminUserAction: mainFunctions.createAdminUserAction,
  getIdListOfAdminUserActionByField:
    mainFunctions.getIdListOfAdminUserActionByField,
  getAdminUserActionById: mainFunctions.getAdminUserActionById,
  getAdminUserActionAggById: mainFunctions.getAdminUserActionAggById,
  getAdminUserActionListByQuery: mainFunctions.getAdminUserActionListByQuery,
  getAdminUserActionStatsByQuery: mainFunctions.getAdminUserActionStatsByQuery,
  getAdminUserActionByQuery: mainFunctions.getAdminUserActionByQuery,
  updateAdminUserActionById: mainFunctions.updateAdminUserActionById,
  updateAdminUserActionByIdList: mainFunctions.updateAdminUserActionByIdList,
  updateAdminUserActionByQuery: mainFunctions.updateAdminUserActionByQuery,
  deleteAdminUserActionById: mainFunctions.deleteAdminUserActionById,
  deleteAdminUserActionByQuery: mainFunctions.deleteAdminUserActionByQuery,
  // GdprExportRequest Db Object
  dbGetGdprexportrequest: mainFunctions.dbGetGdprexportrequest,
  dbCreateGdprexportrequest: mainFunctions.dbCreateGdprexportrequest,
  dbUpdateGdprexportrequest: mainFunctions.dbUpdateGdprexportrequest,
  dbDeleteGdprexportrequest: mainFunctions.dbDeleteGdprexportrequest,
  dbListGdprexportrequests: mainFunctions.dbListGdprexportrequests,
  createGdprExportRequest: mainFunctions.createGdprExportRequest,
  getIdListOfGdprExportRequestByField:
    mainFunctions.getIdListOfGdprExportRequestByField,
  getGdprExportRequestById: mainFunctions.getGdprExportRequestById,
  getGdprExportRequestAggById: mainFunctions.getGdprExportRequestAggById,
  getGdprExportRequestListByQuery:
    mainFunctions.getGdprExportRequestListByQuery,
  getGdprExportRequestStatsByQuery:
    mainFunctions.getGdprExportRequestStatsByQuery,
  getGdprExportRequestByQuery: mainFunctions.getGdprExportRequestByQuery,
  updateGdprExportRequestById: mainFunctions.updateGdprExportRequestById,
  updateGdprExportRequestByIdList:
    mainFunctions.updateGdprExportRequestByIdList,
  updateGdprExportRequestByQuery: mainFunctions.updateGdprExportRequestByQuery,
  deleteGdprExportRequestById: mainFunctions.deleteGdprExportRequestById,
  deleteGdprExportRequestByQuery: mainFunctions.deleteGdprExportRequestByQuery,
  // GdprDeleteRequest Db Object
  dbGetGdprdeleterequest: mainFunctions.dbGetGdprdeleterequest,
  dbCreateGdprdeleterequest: mainFunctions.dbCreateGdprdeleterequest,
  dbUpdateGdprdeleterequest: mainFunctions.dbUpdateGdprdeleterequest,
  dbDeleteGdprdeleterequest: mainFunctions.dbDeleteGdprdeleterequest,
  dbListGdprdeleterequests: mainFunctions.dbListGdprdeleterequests,
  createGdprDeleteRequest: mainFunctions.createGdprDeleteRequest,
  getIdListOfGdprDeleteRequestByField:
    mainFunctions.getIdListOfGdprDeleteRequestByField,
  getGdprDeleteRequestById: mainFunctions.getGdprDeleteRequestById,
  getGdprDeleteRequestAggById: mainFunctions.getGdprDeleteRequestAggById,
  getGdprDeleteRequestListByQuery:
    mainFunctions.getGdprDeleteRequestListByQuery,
  getGdprDeleteRequestStatsByQuery:
    mainFunctions.getGdprDeleteRequestStatsByQuery,
  getGdprDeleteRequestByQuery: mainFunctions.getGdprDeleteRequestByQuery,
  updateGdprDeleteRequestById: mainFunctions.updateGdprDeleteRequestById,
  updateGdprDeleteRequestByIdList:
    mainFunctions.updateGdprDeleteRequestByIdList,
  updateGdprDeleteRequestByQuery: mainFunctions.updateGdprDeleteRequestByQuery,
  deleteGdprDeleteRequestById: mainFunctions.deleteGdprDeleteRequestById,
  deleteGdprDeleteRequestByQuery: mainFunctions.deleteGdprDeleteRequestByQuery,
  // CompliancePolicy Db Object
  dbGetCompliancepolicy: mainFunctions.dbGetCompliancepolicy,
  dbCreateCompliancepolicy: mainFunctions.dbCreateCompliancepolicy,
  dbUpdateCompliancepolicy: mainFunctions.dbUpdateCompliancepolicy,
  dbDeleteCompliancepolicy: mainFunctions.dbDeleteCompliancepolicy,
  dbListCompliancepolicies: mainFunctions.dbListCompliancepolicies,
  createCompliancePolicy: mainFunctions.createCompliancePolicy,
  getIdListOfCompliancePolicyByField:
    mainFunctions.getIdListOfCompliancePolicyByField,
  getCompliancePolicyById: mainFunctions.getCompliancePolicyById,
  getCompliancePolicyAggById: mainFunctions.getCompliancePolicyAggById,
  getCompliancePolicyListByQuery: mainFunctions.getCompliancePolicyListByQuery,
  getCompliancePolicyStatsByQuery:
    mainFunctions.getCompliancePolicyStatsByQuery,
  getCompliancePolicyByQuery: mainFunctions.getCompliancePolicyByQuery,
  updateCompliancePolicyById: mainFunctions.updateCompliancePolicyById,
  updateCompliancePolicyByIdList: mainFunctions.updateCompliancePolicyByIdList,
  updateCompliancePolicyByQuery: mainFunctions.updateCompliancePolicyByQuery,
  deleteCompliancePolicyById: mainFunctions.deleteCompliancePolicyById,
  deleteCompliancePolicyByQuery: mainFunctions.deleteCompliancePolicyByQuery,
  // GlobalUserRestriction Db Object
  dbGetGlobaluserrestriction: mainFunctions.dbGetGlobaluserrestriction,
  dbCreateGlobaluserrestriction: mainFunctions.dbCreateGlobaluserrestriction,
  dbUpdateGlobaluserrestriction: mainFunctions.dbUpdateGlobaluserrestriction,
  dbDeleteGlobaluserrestriction: mainFunctions.dbDeleteGlobaluserrestriction,
  dbListGlobaluserrestrictions: mainFunctions.dbListGlobaluserrestrictions,
  createGlobalUserRestriction: mainFunctions.createGlobalUserRestriction,
  getIdListOfGlobalUserRestrictionByField:
    mainFunctions.getIdListOfGlobalUserRestrictionByField,
  getGlobalUserRestrictionById: mainFunctions.getGlobalUserRestrictionById,
  getGlobalUserRestrictionAggById:
    mainFunctions.getGlobalUserRestrictionAggById,
  getGlobalUserRestrictionListByQuery:
    mainFunctions.getGlobalUserRestrictionListByQuery,
  getGlobalUserRestrictionStatsByQuery:
    mainFunctions.getGlobalUserRestrictionStatsByQuery,
  getGlobalUserRestrictionByQuery:
    mainFunctions.getGlobalUserRestrictionByQuery,
  updateGlobalUserRestrictionById:
    mainFunctions.updateGlobalUserRestrictionById,
  updateGlobalUserRestrictionByIdList:
    mainFunctions.updateGlobalUserRestrictionByIdList,
  updateGlobalUserRestrictionByQuery:
    mainFunctions.updateGlobalUserRestrictionByQuery,
  deleteGlobalUserRestrictionById:
    mainFunctions.deleteGlobalUserRestrictionById,
  deleteGlobalUserRestrictionByQuery:
    mainFunctions.deleteGlobalUserRestrictionByQuery,
};
