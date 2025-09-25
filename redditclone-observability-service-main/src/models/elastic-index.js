const { ElasticIndexer } = require("serviceCommon");
const { hexaLogger } = require("common");

const systemMetricMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  timestamp: { type: "date", index: true },
  serviceName: { type: "keyword", index: true },
  host: { type: "keyword", index: true },
  metricName: { type: "keyword", index: true },
  metricValue: { type: "double", index: true },
  unit: { type: "keyword", index: true },
  tags: { properties: {} },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const errorLogMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  timestamp: { type: "date", index: true },
  serviceName: { type: "keyword", index: true },
  errorType: { type: "keyword", index: true },
  message: { type: "text", index: true },
  severity: { type: "keyword", index: true },
  severity_: { type: "keyword" },
  stackTrace: { type: "text", index: true },
  context: { type: "object", enabled: false },
  userId: { type: "keyword", index: true },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const sloEventMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  eventTime: { type: "date", index: true },
  serviceName: { type: "keyword", index: true },
  eventType: { type: "keyword", index: true },
  eventType_: { type: "keyword" },
  status: { type: "keyword", index: true },
  status_: { type: "keyword" },
  notes: { type: "text", index: true },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const auditLogMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  timestamp: { type: "date", index: true },
  eventType: { type: "keyword", index: true },
  userId: { type: "keyword", index: true },
  message: { type: "text", index: true },
  targetType: { type: "keyword", index: true },
  targetId: { type: "keyword", index: true },
  details: { type: "object", enabled: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const alertMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  title: { type: "keyword", index: true },
  affectedServices: { type: "keyword", index: true },
  status: { type: "keyword", index: true },
  status_: { type: "keyword" },
  severity: { type: "keyword", index: true },
  severity_: { type: "keyword" },
  sloEventIds: { type: "keyword", index: false },
  errorLogIds: { type: "keyword", index: false },
  resolvedByUserId: { type: "keyword", index: true },
  notes: { type: "text", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};

const updateElasticIndexMappings = async () => {
  try {
    ElasticIndexer.addMapping("systemMetric", systemMetricMapping);
    await new ElasticIndexer("systemMetric").updateMapping(systemMetricMapping);
    ElasticIndexer.addMapping("errorLog", errorLogMapping);
    await new ElasticIndexer("errorLog").updateMapping(errorLogMapping);
    ElasticIndexer.addMapping("sloEvent", sloEventMapping);
    await new ElasticIndexer("sloEvent").updateMapping(sloEventMapping);
    ElasticIndexer.addMapping("auditLog", auditLogMapping);
    await new ElasticIndexer("auditLog").updateMapping(auditLogMapping);
    ElasticIndexer.addMapping("alert", alertMapping);
    await new ElasticIndexer("alert").updateMapping(alertMapping);
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
