const { DataTypes } = require("sequelize");
const { getEnumValue } = require("serviceCommon");
const { ElasticIndexer } = require("serviceCommon");
const updateElasticIndexMappings = require("./elastic-index");
const { hexaLogger } = require("common");

const SystemMetric = require("./systemMetric");
const ErrorLog = require("./errorLog");
const SloEvent = require("./sloEvent");
const AuditLog = require("./auditLog");
const Alert = require("./alert");

SystemMetric.prototype.getData = function () {
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

ErrorLog.prototype.getData = function () {
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
  const severityOptions = ["fatal", "error", "warn", "info", "debug"];
  const dataTypeseverityErrorLog = typeof data.severity;
  const enumIndexseverityErrorLog =
    dataTypeseverityErrorLog === "string"
      ? severityOptions.indexOf(data.severity)
      : data.severity;
  data.severity_idx = enumIndexseverityErrorLog;
  data.severity =
    enumIndexseverityErrorLog > -1
      ? severityOptions[enumIndexseverityErrorLog]
      : undefined;

  return data;
};

SloEvent.prototype.getData = function () {
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
  const eventTypeOptions = [
    "breach",
    "slow",
    "outage",
    "recovery",
    "maintenance",
    "incident",
    "other",
  ];
  const dataTypeeventTypeSloEvent = typeof data.eventType;
  const enumIndexeventTypeSloEvent =
    dataTypeeventTypeSloEvent === "string"
      ? eventTypeOptions.indexOf(data.eventType)
      : data.eventType;
  data.eventType_idx = enumIndexeventTypeSloEvent;
  data.eventType =
    enumIndexeventTypeSloEvent > -1
      ? eventTypeOptions[enumIndexeventTypeSloEvent]
      : undefined;
  // set enum Index and enum value
  const statusOptions = ["open", "resolved", "inProgress", "closed"];
  const dataTypestatusSloEvent = typeof data.status;
  const enumIndexstatusSloEvent =
    dataTypestatusSloEvent === "string"
      ? statusOptions.indexOf(data.status)
      : data.status;
  data.status_idx = enumIndexstatusSloEvent;
  data.status =
    enumIndexstatusSloEvent > -1
      ? statusOptions[enumIndexstatusSloEvent]
      : undefined;

  return data;
};

AuditLog.prototype.getData = function () {
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

Alert.prototype.getData = function () {
  const data = this.dataValues;

  data.sloEvent = this.sloEvent ? this.sloEvent.getData() : undefined;
  data.errorLog = this.errorLog ? this.errorLog.getData() : undefined;

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
    "open",
    "acknowledged",
    "resolved",
    "closed",
    "suppressed",
  ];
  const dataTypestatusAlert = typeof data.status;
  const enumIndexstatusAlert =
    dataTypestatusAlert === "string"
      ? statusOptions.indexOf(data.status)
      : data.status;
  data.status_idx = enumIndexstatusAlert;
  data.status =
    enumIndexstatusAlert > -1 ? statusOptions[enumIndexstatusAlert] : undefined;
  // set enum Index and enum value
  const severityOptions = ["critical", "high", "medium", "low", "info"];
  const dataTypeseverityAlert = typeof data.severity;
  const enumIndexseverityAlert =
    dataTypeseverityAlert === "string"
      ? severityOptions.indexOf(data.severity)
      : data.severity;
  data.severity_idx = enumIndexseverityAlert;
  data.severity =
    enumIndexseverityAlert > -1
      ? severityOptions[enumIndexseverityAlert]
      : undefined;

  return data;
};

Alert.belongsTo(SloEvent, {
  as: "sloEvent",
  foreignKey: "sloEventIds",
  targetKey: "id",
  constraints: false,
});

Alert.belongsTo(ErrorLog, {
  as: "errorLog",
  foreignKey: "errorLogIds",
  targetKey: "id",
  constraints: false,
});

module.exports = {
  SystemMetric,
  ErrorLog,
  SloEvent,
  AuditLog,
  Alert,
  updateElasticIndexMappings,
};
