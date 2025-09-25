const { DataTypes } = require("sequelize");
const { getEnumValue } = require("serviceCommon");
const { ElasticIndexer } = require("serviceCommon");
const updateElasticIndexMappings = require("./elastic-index");
const { hexaLogger } = require("common");

const AbuseReport = require("./abuseReport");
const AbuseFlag = require("./abuseFlag");
const AbuseHeuristicTrigger = require("./abuseHeuristicTrigger");
const AbuseInvestigation = require("./abuseInvestigation");

AbuseReport.prototype.getData = function () {
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
  const reportTypeOptions = [
    "spam",
    "harassment",
    "ruleViolation",
    "nsfw",
    "malware",
    "selfHarm",
    "impersonation",
    "other",
  ];
  const dataTypereportTypeAbuseReport = typeof data.reportType;
  const enumIndexreportTypeAbuseReport =
    dataTypereportTypeAbuseReport === "string"
      ? reportTypeOptions.indexOf(data.reportType)
      : data.reportType;
  data.reportType_idx = enumIndexreportTypeAbuseReport;
  data.reportType =
    enumIndexreportTypeAbuseReport > -1
      ? reportTypeOptions[enumIndexreportTypeAbuseReport]
      : undefined;
  // set enum Index and enum value
  const reportStatusOptions = [
    "new",
    "underReview",
    "forwarded",
    "resolved",
    "dismissed",
    "invalid",
  ];
  const dataTypereportStatusAbuseReport = typeof data.reportStatus;
  const enumIndexreportStatusAbuseReport =
    dataTypereportStatusAbuseReport === "string"
      ? reportStatusOptions.indexOf(data.reportStatus)
      : data.reportStatus;
  data.reportStatus_idx = enumIndexreportStatusAbuseReport;
  data.reportStatus =
    enumIndexreportStatusAbuseReport > -1
      ? reportStatusOptions[enumIndexreportStatusAbuseReport]
      : undefined;
  // set enum Index and enum value
  const originOptions = ["user", "automod", "external"];
  const dataTypeoriginAbuseReport = typeof data.origin;
  const enumIndexoriginAbuseReport =
    dataTypeoriginAbuseReport === "string"
      ? originOptions.indexOf(data.origin)
      : data.origin;
  data.origin_idx = enumIndexoriginAbuseReport;
  data.origin =
    enumIndexoriginAbuseReport > -1
      ? originOptions[enumIndexoriginAbuseReport]
      : undefined;
  // set enum Index and enum value
  const resolutionResultOptions = [
    "none",
    "contentRemoved",
    "userRestricted",
    "noAction",
    "invalid",
    "banned",
    "other",
  ];
  const dataTyperesolutionResultAbuseReport = typeof data.resolutionResult;
  const enumIndexresolutionResultAbuseReport =
    dataTyperesolutionResultAbuseReport === "string"
      ? resolutionResultOptions.indexOf(data.resolutionResult)
      : data.resolutionResult;
  data.resolutionResult_idx = enumIndexresolutionResultAbuseReport;
  data.resolutionResult =
    enumIndexresolutionResultAbuseReport > -1
      ? resolutionResultOptions[enumIndexresolutionResultAbuseReport]
      : undefined;

  data._owner = data.reporterUserId ?? undefined;
  return data;
};

AbuseFlag.prototype.getData = function () {
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
  const flagTypeOptions = [
    "spam",
    "nsfw",
    "rateAbuse",
    "suspicious",
    "malware",
    "banEvasion",
    "automodCustom",
    "other",
  ];
  const dataTypeflagTypeAbuseFlag = typeof data.flagType;
  const enumIndexflagTypeAbuseFlag =
    dataTypeflagTypeAbuseFlag === "string"
      ? flagTypeOptions.indexOf(data.flagType)
      : data.flagType;
  data.flagType_idx = enumIndexflagTypeAbuseFlag;
  data.flagType =
    enumIndexflagTypeAbuseFlag > -1
      ? flagTypeOptions[enumIndexflagTypeAbuseFlag]
      : undefined;
  // set enum Index and enum value
  const flagStatusOptions = [
    "active",
    "reviewed",
    "dismissed",
    "escalated",
    "resolved",
    "suppressed",
  ];
  const dataTypeflagStatusAbuseFlag = typeof data.flagStatus;
  const enumIndexflagStatusAbuseFlag =
    dataTypeflagStatusAbuseFlag === "string"
      ? flagStatusOptions.indexOf(data.flagStatus)
      : data.flagStatus;
  data.flagStatus_idx = enumIndexflagStatusAbuseFlag;
  data.flagStatus =
    enumIndexflagStatusAbuseFlag > -1
      ? flagStatusOptions[enumIndexflagStatusAbuseFlag]
      : undefined;
  // set enum Index and enum value
  const originOptions = [
    "automod",
    "rateLimiter",
    "modtool",
    "admin",
    "external",
  ];
  const dataTypeoriginAbuseFlag = typeof data.origin;
  const enumIndexoriginAbuseFlag =
    dataTypeoriginAbuseFlag === "string"
      ? originOptions.indexOf(data.origin)
      : data.origin;
  data.origin_idx = enumIndexoriginAbuseFlag;
  data.origin =
    enumIndexoriginAbuseFlag > -1
      ? originOptions[enumIndexoriginAbuseFlag]
      : undefined;

  return data;
};

AbuseHeuristicTrigger.prototype.getData = function () {
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
  const triggerTypeOptions = [
    "rateExceeded",
    "floodAttempt",
    "spamPattern",
    "abusePhrase",
    "botSuspect",
    "multiAccount",
    "rapidVote",
    "other",
  ];
  const dataTypetriggerTypeAbuseHeuristicTrigger = typeof data.triggerType;
  const enumIndextriggerTypeAbuseHeuristicTrigger =
    dataTypetriggerTypeAbuseHeuristicTrigger === "string"
      ? triggerTypeOptions.indexOf(data.triggerType)
      : data.triggerType;
  data.triggerType_idx = enumIndextriggerTypeAbuseHeuristicTrigger;
  data.triggerType =
    enumIndextriggerTypeAbuseHeuristicTrigger > -1
      ? triggerTypeOptions[enumIndextriggerTypeAbuseHeuristicTrigger]
      : undefined;

  return data;
};

AbuseInvestigation.prototype.getData = function () {
  const data = this.dataValues;

  data.investigatedReports = this.investigatedReports
    ? this.investigatedReports.getData()
    : undefined;
  data.investigatedFlags = this.investigatedFlags
    ? this.investigatedFlags.getData()
    : undefined;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const investigationStatusOptions = [
    "open",
    "inProgress",
    "closed",
    "escalated",
    "dismissed",
    "duplicate",
  ];
  const dataTypeinvestigationStatusAbuseInvestigation =
    typeof data.investigationStatus;
  const enumIndexinvestigationStatusAbuseInvestigation =
    dataTypeinvestigationStatusAbuseInvestigation === "string"
      ? investigationStatusOptions.indexOf(data.investigationStatus)
      : data.investigationStatus;
  data.investigationStatus_idx = enumIndexinvestigationStatusAbuseInvestigation;
  data.investigationStatus =
    enumIndexinvestigationStatusAbuseInvestigation > -1
      ? investigationStatusOptions[
          enumIndexinvestigationStatusAbuseInvestigation
        ]
      : undefined;

  return data;
};

AbuseInvestigation.belongsTo(AbuseReport, {
  as: "investigatedReports",
  foreignKey: "relatedReportIds",
  targetKey: "id",
  constraints: false,
});

AbuseInvestigation.belongsTo(AbuseFlag, {
  as: "investigatedFlags",
  foreignKey: "relatedFlagIds",
  targetKey: "id",
  constraints: false,
});

module.exports = {
  AbuseReport,
  AbuseFlag,
  AbuseHeuristicTrigger,
  AbuseInvestigation,
  updateElasticIndexMappings,
};
