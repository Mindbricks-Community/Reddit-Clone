const { ElasticIndexer } = require("serviceCommon");
const { hexaLogger } = require("common");

const moderationActionMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  communityId: { type: "keyword", index: true },
  targetType: { type: "keyword", index: true },
  targetType_: { type: "keyword" },
  targetId: { type: "keyword", index: false },
  actionType: { type: "keyword", index: true },
  actionType_: { type: "keyword" },
  performedByUserId: { type: "keyword", index: false },
  performedByRole: { type: "keyword", index: false },
  performedByRole_: { type: "keyword" },
  reason: { type: "keyword", index: false },
  notes: { type: "text", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const automodEventMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  communityId: { type: "keyword", index: true },
  targetType: { type: "keyword", index: false },
  targetType_: { type: "keyword" },
  targetId: { type: "keyword", index: false },
  automodType: { type: "keyword", index: true },
  automodType_: { type: "keyword" },
  ruleId: { type: "keyword", index: false },
  performedByAutomod: { type: "boolean", null_value: false },
  triggerDetails: { type: "object", enabled: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const moderationAuditLogMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  logEntryType: { type: "keyword", index: true },
  logEntryType_: { type: "keyword" },
  communityId: { type: "keyword", index: true },
  entityType: { type: "keyword", index: false },
  entityType_: { type: "keyword" },
  entityId: { type: "keyword", index: false },
  actionUserId: { type: "keyword", index: false },
  linkedModerationActionId: { type: "keyword", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const modmailThreadMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  communityId: { type: "keyword", index: true },
  subject: { type: "keyword", index: true },
  createdByUserId: { type: "keyword", index: false },
  status: { type: "keyword", index: false },
  status_: { type: "keyword" },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const modmailMessageMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  threadId: { type: "keyword", index: false },
  senderUserId: { type: "keyword", index: false },
  messageBody: { type: "text", index: false },
  messageType: { type: "keyword", index: false },
  messageType_: { type: "keyword" },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};

const updateElasticIndexMappings = async () => {
  try {
    ElasticIndexer.addMapping("moderationAction", moderationActionMapping);
    await new ElasticIndexer("moderationAction").updateMapping(
      moderationActionMapping,
    );
    ElasticIndexer.addMapping("automodEvent", automodEventMapping);
    await new ElasticIndexer("automodEvent").updateMapping(automodEventMapping);
    ElasticIndexer.addMapping("moderationAuditLog", moderationAuditLogMapping);
    await new ElasticIndexer("moderationAuditLog").updateMapping(
      moderationAuditLogMapping,
    );
    ElasticIndexer.addMapping("modmailThread", modmailThreadMapping);
    await new ElasticIndexer("modmailThread").updateMapping(
      modmailThreadMapping,
    );
    ElasticIndexer.addMapping("modmailMessage", modmailMessageMapping);
    await new ElasticIndexer("modmailMessage").updateMapping(
      modmailMessageMapping,
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
