const utils = require("./utils");

module.exports = {
  dbGetCompliancepolicy: require("./dbGetCompliancepolicy"),
  dbCreateCompliancepolicy: require("./dbCreateCompliancepolicy"),
  dbUpdateCompliancepolicy: require("./dbUpdateCompliancepolicy"),
  dbDeleteCompliancepolicy: require("./dbDeleteCompliancepolicy"),
  dbListCompliancepolicies: require("./dbListCompliancepolicies"),
  createCompliancePolicy: utils.createCompliancePolicy,
  getIdListOfCompliancePolicyByField: utils.getIdListOfCompliancePolicyByField,
  getCompliancePolicyById: utils.getCompliancePolicyById,
  getCompliancePolicyAggById: utils.getCompliancePolicyAggById,
  getCompliancePolicyListByQuery: utils.getCompliancePolicyListByQuery,
  getCompliancePolicyStatsByQuery: utils.getCompliancePolicyStatsByQuery,
  getCompliancePolicyByQuery: utils.getCompliancePolicyByQuery,
  updateCompliancePolicyById: utils.updateCompliancePolicyById,
  updateCompliancePolicyByIdList: utils.updateCompliancePolicyByIdList,
  updateCompliancePolicyByQuery: utils.updateCompliancePolicyByQuery,
  deleteCompliancePolicyById: utils.deleteCompliancePolicyById,
  deleteCompliancePolicyByQuery: utils.deleteCompliancePolicyByQuery,
};
