const { ElasticIndexer } = require("serviceCommon");
const { hexaLogger } = require("common");

const adminUserActionMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  adminId: { type: "keyword", index: true },
  targetType: { type: "keyword", index: true },
  targetType_: { type: "keyword" },
  targetId: { type: "keyword", index: true },
  actionType: { type: "keyword", index: true },
  actionType_: { type: "keyword" },
  reason: { type: "keyword", index: true },
  notes: { type: "text", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const gdprExportRequestMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  userId: { type: "keyword", index: true },
  requestedByAdminId: { type: "keyword", index: false },
  status: { type: "keyword", index: true },
  status_: { type: "keyword" },
  exportUrl: { type: "keyword", index: false },
  errorMsg: { type: "keyword", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const gdprDeleteRequestMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  userId: { type: "keyword", index: true },
  requestedByAdminId: { type: "keyword", index: false },
  status: { type: "keyword", index: true },
  status_: { type: "keyword" },
  errorMsg: { type: "keyword", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const compliancePolicyMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  minAge: { type: "integer", index: true },
  gdprExportEnabled: { type: "boolean", null_value: false },
  gdprDeleteEnabled: { type: "boolean", null_value: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const globalUserRestrictionMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  userId: { type: "keyword", index: true },
  restrictionType: { type: "keyword", index: true },
  restrictionType_: { type: "keyword" },
  status: { type: "keyword", index: true },
  status_: { type: "keyword" },
  startDate: { type: "date", index: false },
  endDate: { type: "date", index: false },
  reason: { type: "keyword", index: false },
  adminId: { type: "keyword", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};

const updateElasticIndexMappings = async () => {
  try {
    ElasticIndexer.addMapping("adminUserAction", adminUserActionMapping);
    await new ElasticIndexer("adminUserAction").updateMapping(
      adminUserActionMapping,
    );
    ElasticIndexer.addMapping("gdprExportRequest", gdprExportRequestMapping);
    await new ElasticIndexer("gdprExportRequest").updateMapping(
      gdprExportRequestMapping,
    );
    ElasticIndexer.addMapping("gdprDeleteRequest", gdprDeleteRequestMapping);
    await new ElasticIndexer("gdprDeleteRequest").updateMapping(
      gdprDeleteRequestMapping,
    );
    ElasticIndexer.addMapping("compliancePolicy", compliancePolicyMapping);
    await new ElasticIndexer("compliancePolicy").updateMapping(
      compliancePolicyMapping,
    );
    ElasticIndexer.addMapping(
      "globalUserRestriction",
      globalUserRestrictionMapping,
    );
    await new ElasticIndexer("globalUserRestriction").updateMapping(
      globalUserRestrictionMapping,
    );
  } catch (err) {
    hexaLogger.insertError(
      "UpdateElasticIndexMappingsError",
      { function: "updateElasticIndexMappings" },
      "elastic-index.js->updateElasticIndexMappings",
      err,
    );
  }
};

module.exports = updateElasticIndexMappings;
