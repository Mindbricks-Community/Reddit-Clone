const { DataTypes } = require("sequelize");
const { getEnumValue } = require("serviceCommon");
const { ElasticIndexer } = require("serviceCommon");
const updateElasticIndexMappings = require("./elastic-index");
const { hexaLogger } = require("common");

const AdminUserAction = require("./adminUserAction");
const GdprExportRequest = require("./gdprExportRequest");
const GdprDeleteRequest = require("./gdprDeleteRequest");
const CompliancePolicy = require("./compliancePolicy");
const GlobalUserRestriction = require("./globalUserRestriction");

AdminUserAction.prototype.getData = function () {
  const data = this.dataValues;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const targetTypeOptions = ["user", "post", "comment", "other"];
  const dataTypetargetTypeAdminUserAction = typeof data.targetType;
  const enumIndextargetTypeAdminUserAction =
    dataTypetargetTypeAdminUserAction === "string"
      ? targetTypeOptions.indexOf(data.targetType)
      : data.targetType;
  data.targetType_idx = enumIndextargetTypeAdminUserAction;
  data.targetType =
    enumIndextargetTypeAdminUserAction > -1
      ? targetTypeOptions[enumIndextargetTypeAdminUserAction]
      : undefined;
  // set enum Index and enum value
  const actionTypeOptions = [
    "ban",
    "unban",
    "suspend",
    "warn",
    "removeContent",
    "unlockContent",
    "exportData",
    "deleteAccount",
    "overrideRestriction",
    "other",
  ];
  const dataTypeactionTypeAdminUserAction = typeof data.actionType;
  const enumIndexactionTypeAdminUserAction =
    dataTypeactionTypeAdminUserAction === "string"
      ? actionTypeOptions.indexOf(data.actionType)
      : data.actionType;
  data.actionType_idx = enumIndexactionTypeAdminUserAction;
  data.actionType =
    enumIndexactionTypeAdminUserAction > -1
      ? actionTypeOptions[enumIndexactionTypeAdminUserAction]
      : undefined;

  return data;
};

GdprExportRequest.prototype.getData = function () {
  const data = this.dataValues;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const statusOptions = [
    "pending",
    "processing",
    "completed",
    "failed",
    "canceled",
  ];
  const dataTypestatusGdprExportRequest = typeof data.status;
  const enumIndexstatusGdprExportRequest =
    dataTypestatusGdprExportRequest === "string"
      ? statusOptions.indexOf(data.status)
      : data.status;
  data.status_idx = enumIndexstatusGdprExportRequest;
  data.status =
    enumIndexstatusGdprExportRequest > -1
      ? statusOptions[enumIndexstatusGdprExportRequest]
      : undefined;

  return data;
};

GdprDeleteRequest.prototype.getData = function () {
  const data = this.dataValues;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const statusOptions = [
    "pending",
    "processing",
    "completed",
    "failed",
    "canceled",
  ];
  const dataTypestatusGdprDeleteRequest = typeof data.status;
  const enumIndexstatusGdprDeleteRequest =
    dataTypestatusGdprDeleteRequest === "string"
      ? statusOptions.indexOf(data.status)
      : data.status;
  data.status_idx = enumIndexstatusGdprDeleteRequest;
  data.status =
    enumIndexstatusGdprDeleteRequest > -1
      ? statusOptions[enumIndexstatusGdprDeleteRequest]
      : undefined;

  return data;
};

CompliancePolicy.prototype.getData = function () {
  const data = this.dataValues;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  return data;
};

GlobalUserRestriction.prototype.getData = function () {
  const data = this.dataValues;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const restrictionTypeOptions = ["ban", "suspend", "shadowban"];
  const dataTyperestrictionTypeGlobalUserRestriction =
    typeof data.restrictionType;
  const enumIndexrestrictionTypeGlobalUserRestriction =
    dataTyperestrictionTypeGlobalUserRestriction === "string"
      ? restrictionTypeOptions.indexOf(data.restrictionType)
      : data.restrictionType;
  data.restrictionType_idx = enumIndexrestrictionTypeGlobalUserRestriction;
  data.restrictionType =
    enumIndexrestrictionTypeGlobalUserRestriction > -1
      ? restrictionTypeOptions[enumIndexrestrictionTypeGlobalUserRestriction]
      : undefined;
  // set enum Index and enum value
  const statusOptions = ["active", "revoked", "expired"];
  const dataTypestatusGlobalUserRestriction = typeof data.status;
  const enumIndexstatusGlobalUserRestriction =
    dataTypestatusGlobalUserRestriction === "string"
      ? statusOptions.indexOf(data.status)
      : data.status;
  data.status_idx = enumIndexstatusGlobalUserRestriction;
  data.status =
    enumIndexstatusGlobalUserRestriction > -1
      ? statusOptions[enumIndexstatusGlobalUserRestriction]
      : undefined;

  return data;
};

module.exports = {
  AdminUserAction,
  GdprExportRequest,
  GdprDeleteRequest,
  CompliancePolicy,
  GlobalUserRestriction,
  updateElasticIndexMappings,
};
