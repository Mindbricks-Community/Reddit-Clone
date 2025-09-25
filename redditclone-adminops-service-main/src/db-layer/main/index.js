const adminUserActionFunctions = require("./adminUserAction");
const gdprExportRequestFunctions = require("./gdprExportRequest");
const gdprDeleteRequestFunctions = require("./gdprDeleteRequest");
const compliancePolicyFunctions = require("./compliancePolicy");
const globalUserRestrictionFunctions = require("./globalUserRestriction");

module.exports = {
  // main Database
  // AdminUserAction Db Object
  dbGetAdminuseraction: adminUserActionFunctions.dbGetAdminuseraction,
  dbCreateAdminuseraction: adminUserActionFunctions.dbCreateAdminuseraction,
  dbUpdateAdminuseraction: adminUserActionFunctions.dbUpdateAdminuseraction,
  dbDeleteAdminuseraction: adminUserActionFunctions.dbDeleteAdminuseraction,
  dbListAdminuseractions: adminUserActionFunctions.dbListAdminuseractions,
  createAdminUserAction: adminUserActionFunctions.createAdminUserAction,
  getIdListOfAdminUserActionByField:
    adminUserActionFunctions.getIdListOfAdminUserActionByField,
  getAdminUserActionById: adminUserActionFunctions.getAdminUserActionById,
  getAdminUserActionAggById: adminUserActionFunctions.getAdminUserActionAggById,
  getAdminUserActionListByQuery:
    adminUserActionFunctions.getAdminUserActionListByQuery,
  getAdminUserActionStatsByQuery:
    adminUserActionFunctions.getAdminUserActionStatsByQuery,
  getAdminUserActionByQuery: adminUserActionFunctions.getAdminUserActionByQuery,
  updateAdminUserActionById: adminUserActionFunctions.updateAdminUserActionById,
  updateAdminUserActionByIdList:
    adminUserActionFunctions.updateAdminUserActionByIdList,
  updateAdminUserActionByQuery:
    adminUserActionFunctions.updateAdminUserActionByQuery,
  deleteAdminUserActionById: adminUserActionFunctions.deleteAdminUserActionById,
  deleteAdminUserActionByQuery:
    adminUserActionFunctions.deleteAdminUserActionByQuery,
  // GdprExportRequest Db Object
  dbGetGdprexportrequest: gdprExportRequestFunctions.dbGetGdprexportrequest,
  dbCreateGdprexportrequest:
    gdprExportRequestFunctions.dbCreateGdprexportrequest,
  dbUpdateGdprexportrequest:
    gdprExportRequestFunctions.dbUpdateGdprexportrequest,
  dbDeleteGdprexportrequest:
    gdprExportRequestFunctions.dbDeleteGdprexportrequest,
  dbListGdprexportrequests: gdprExportRequestFunctions.dbListGdprexportrequests,
  createGdprExportRequest: gdprExportRequestFunctions.createGdprExportRequest,
  getIdListOfGdprExportRequestByField:
    gdprExportRequestFunctions.getIdListOfGdprExportRequestByField,
  getGdprExportRequestById: gdprExportRequestFunctions.getGdprExportRequestById,
  getGdprExportRequestAggById:
    gdprExportRequestFunctions.getGdprExportRequestAggById,
  getGdprExportRequestListByQuery:
    gdprExportRequestFunctions.getGdprExportRequestListByQuery,
  getGdprExportRequestStatsByQuery:
    gdprExportRequestFunctions.getGdprExportRequestStatsByQuery,
  getGdprExportRequestByQuery:
    gdprExportRequestFunctions.getGdprExportRequestByQuery,
  updateGdprExportRequestById:
    gdprExportRequestFunctions.updateGdprExportRequestById,
  updateGdprExportRequestByIdList:
    gdprExportRequestFunctions.updateGdprExportRequestByIdList,
  updateGdprExportRequestByQuery:
    gdprExportRequestFunctions.updateGdprExportRequestByQuery,
  deleteGdprExportRequestById:
    gdprExportRequestFunctions.deleteGdprExportRequestById,
  deleteGdprExportRequestByQuery:
    gdprExportRequestFunctions.deleteGdprExportRequestByQuery,
  // GdprDeleteRequest Db Object
  dbGetGdprdeleterequest: gdprDeleteRequestFunctions.dbGetGdprdeleterequest,
  dbCreateGdprdeleterequest:
    gdprDeleteRequestFunctions.dbCreateGdprdeleterequest,
  dbUpdateGdprdeleterequest:
    gdprDeleteRequestFunctions.dbUpdateGdprdeleterequest,
  dbDeleteGdprdeleterequest:
    gdprDeleteRequestFunctions.dbDeleteGdprdeleterequest,
  dbListGdprdeleterequests: gdprDeleteRequestFunctions.dbListGdprdeleterequests,
  createGdprDeleteRequest: gdprDeleteRequestFunctions.createGdprDeleteRequest,
  getIdListOfGdprDeleteRequestByField:
    gdprDeleteRequestFunctions.getIdListOfGdprDeleteRequestByField,
  getGdprDeleteRequestById: gdprDeleteRequestFunctions.getGdprDeleteRequestById,
  getGdprDeleteRequestAggById:
    gdprDeleteRequestFunctions.getGdprDeleteRequestAggById,
  getGdprDeleteRequestListByQuery:
    gdprDeleteRequestFunctions.getGdprDeleteRequestListByQuery,
  getGdprDeleteRequestStatsByQuery:
    gdprDeleteRequestFunctions.getGdprDeleteRequestStatsByQuery,
  getGdprDeleteRequestByQuery:
    gdprDeleteRequestFunctions.getGdprDeleteRequestByQuery,
  updateGdprDeleteRequestById:
    gdprDeleteRequestFunctions.updateGdprDeleteRequestById,
  updateGdprDeleteRequestByIdList:
    gdprDeleteRequestFunctions.updateGdprDeleteRequestByIdList,
  updateGdprDeleteRequestByQuery:
    gdprDeleteRequestFunctions.updateGdprDeleteRequestByQuery,
  deleteGdprDeleteRequestById:
    gdprDeleteRequestFunctions.deleteGdprDeleteRequestById,
  deleteGdprDeleteRequestByQuery:
    gdprDeleteRequestFunctions.deleteGdprDeleteRequestByQuery,
  // CompliancePolicy Db Object
  dbGetCompliancepolicy: compliancePolicyFunctions.dbGetCompliancepolicy,
  dbCreateCompliancepolicy: compliancePolicyFunctions.dbCreateCompliancepolicy,
  dbUpdateCompliancepolicy: compliancePolicyFunctions.dbUpdateCompliancepolicy,
  dbDeleteCompliancepolicy: compliancePolicyFunctions.dbDeleteCompliancepolicy,
  dbListCompliancepolicies: compliancePolicyFunctions.dbListCompliancepolicies,
  createCompliancePolicy: compliancePolicyFunctions.createCompliancePolicy,
  getIdListOfCompliancePolicyByField:
    compliancePolicyFunctions.getIdListOfCompliancePolicyByField,
  getCompliancePolicyById: compliancePolicyFunctions.getCompliancePolicyById,
  getCompliancePolicyAggById:
    compliancePolicyFunctions.getCompliancePolicyAggById,
  getCompliancePolicyListByQuery:
    compliancePolicyFunctions.getCompliancePolicyListByQuery,
  getCompliancePolicyStatsByQuery:
    compliancePolicyFunctions.getCompliancePolicyStatsByQuery,
  getCompliancePolicyByQuery:
    compliancePolicyFunctions.getCompliancePolicyByQuery,
  updateCompliancePolicyById:
    compliancePolicyFunctions.updateCompliancePolicyById,
  updateCompliancePolicyByIdList:
    compliancePolicyFunctions.updateCompliancePolicyByIdList,
  updateCompliancePolicyByQuery:
    compliancePolicyFunctions.updateCompliancePolicyByQuery,
  deleteCompliancePolicyById:
    compliancePolicyFunctions.deleteCompliancePolicyById,
  deleteCompliancePolicyByQuery:
    compliancePolicyFunctions.deleteCompliancePolicyByQuery,
  // GlobalUserRestriction Db Object
  dbGetGlobaluserrestriction:
    globalUserRestrictionFunctions.dbGetGlobaluserrestriction,
  dbCreateGlobaluserrestriction:
    globalUserRestrictionFunctions.dbCreateGlobaluserrestriction,
  dbUpdateGlobaluserrestriction:
    globalUserRestrictionFunctions.dbUpdateGlobaluserrestriction,
  dbDeleteGlobaluserrestriction:
    globalUserRestrictionFunctions.dbDeleteGlobaluserrestriction,
  dbListGlobaluserrestrictions:
    globalUserRestrictionFunctions.dbListGlobaluserrestrictions,
  createGlobalUserRestriction:
    globalUserRestrictionFunctions.createGlobalUserRestriction,
  getIdListOfGlobalUserRestrictionByField:
    globalUserRestrictionFunctions.getIdListOfGlobalUserRestrictionByField,
  getGlobalUserRestrictionById:
    globalUserRestrictionFunctions.getGlobalUserRestrictionById,
  getGlobalUserRestrictionAggById:
    globalUserRestrictionFunctions.getGlobalUserRestrictionAggById,
  getGlobalUserRestrictionListByQuery:
    globalUserRestrictionFunctions.getGlobalUserRestrictionListByQuery,
  getGlobalUserRestrictionStatsByQuery:
    globalUserRestrictionFunctions.getGlobalUserRestrictionStatsByQuery,
  getGlobalUserRestrictionByQuery:
    globalUserRestrictionFunctions.getGlobalUserRestrictionByQuery,
  updateGlobalUserRestrictionById:
    globalUserRestrictionFunctions.updateGlobalUserRestrictionById,
  updateGlobalUserRestrictionByIdList:
    globalUserRestrictionFunctions.updateGlobalUserRestrictionByIdList,
  updateGlobalUserRestrictionByQuery:
    globalUserRestrictionFunctions.updateGlobalUserRestrictionByQuery,
  deleteGlobalUserRestrictionById:
    globalUserRestrictionFunctions.deleteGlobalUserRestrictionById,
  deleteGlobalUserRestrictionByQuery:
    globalUserRestrictionFunctions.deleteGlobalUserRestrictionByQuery,
};
