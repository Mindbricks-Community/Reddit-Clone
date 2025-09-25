const { ElasticIndexer } = require("serviceCommon");
const { hexaLogger } = require("common");

const abuseReportMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  reportType: { type: "keyword", index: true },
  reportType_: { type: "keyword" },
  reportStatus: { type: "keyword", index: true },
  reportStatus_: { type: "keyword" },
  reasonText: { type: "text", index: true },
  reporterUserId: { type: "keyword", index: true },
  reportedUserId: { type: "keyword", index: true },
  postId: { type: "keyword", index: true },
  commentId: { type: "keyword", index: true },
  origin: { type: "keyword", index: true },
  origin_: { type: "keyword" },
  resolutionResult: { type: "keyword", index: true },
  resolutionResult_: { type: "keyword" },
  resolvedByUserId: { type: "keyword", index: false },
  extraData: { type: "object", enabled: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const abuseFlagMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  flagType: { type: "keyword", index: true },
  flagType_: { type: "keyword" },
  flagStatus: { type: "keyword", index: true },
  flagStatus_: { type: "keyword" },
  postId: { type: "keyword", index: true },
  commentId: { type: "keyword", index: true },
  userId: { type: "keyword", index: true },
  mediaObjectId: { type: "keyword", index: true },
  origin: { type: "keyword", index: true },
  origin_: { type: "keyword" },
  details: { type: "object", enabled: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const abuseHeuristicTriggerMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  triggerType: { type: "keyword", index: true },
  triggerType_: { type: "keyword" },
  userId: { type: "keyword", index: true },
  ipAddress: { type: "keyword", index: false },
  targetId: { type: "keyword", index: false },
  details: { type: "object", enabled: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const abuseInvestigationMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  investigationStatus: { type: "keyword", index: true },
  investigationStatus_: { type: "keyword" },
  title: { type: "keyword", index: true },
  openedByUserId: { type: "keyword", index: true },
  assignedToUserIds: { type: "keyword", index: false },
  relatedReportIds: { type: "keyword", index: false },
  relatedFlagIds: { type: "keyword", index: false },
  details: { type: "object", enabled: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};

const updateElasticIndexMappings = async () => {
  try {
    ElasticIndexer.addMapping("abuseReport", abuseReportMapping);
    await new ElasticIndexer("abuseReport").updateMapping(abuseReportMapping);
    ElasticIndexer.addMapping("abuseFlag", abuseFlagMapping);
    await new ElasticIndexer("abuseFlag").updateMapping(abuseFlagMapping);
    ElasticIndexer.addMapping(
      "abuseHeuristicTrigger",
      abuseHeuristicTriggerMapping,
    );
    await new ElasticIndexer("abuseHeuristicTrigger").updateMapping(
      abuseHeuristicTriggerMapping,
    );
    ElasticIndexer.addMapping("abuseInvestigation", abuseInvestigationMapping);
    await new ElasticIndexer("abuseInvestigation").updateMapping(
      abuseInvestigationMapping,
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
