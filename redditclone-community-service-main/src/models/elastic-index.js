const { ElasticIndexer } = require("serviceCommon");
const { hexaLogger } = require("common");

const communityMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  name: { type: "keyword", index: true },
  slug: { type: "keyword", index: true },
  description: { type: "text", index: true },
  creatorId: { type: "keyword", index: false },
  bannerUrl: { type: "keyword", index: false },
  avatarUrl: { type: "keyword", index: false },
  colorScheme: { type: "keyword", index: false },
  privacyLevel: { type: "keyword", index: true },
  privacyLevel_: { type: "keyword" },
  isNsfw: { type: "boolean", null_value: false },
  allowedPostTypes: { type: "keyword", index: false },
  allowedPostTypes_: { type: "keyword" },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const communityMemberMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  communityId: { type: "keyword", index: false },
  userId: { type: "keyword", index: false },
  role: { type: "keyword", index: false },
  role_: { type: "keyword" },
  status: { type: "keyword", index: false },
  status_: { type: "keyword" },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const communityRuleMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  communityId: { type: "keyword", index: false },
  shortName: { type: "keyword", index: true },
  description: { type: "text", index: true },
  orderIndex: { type: "integer", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const communityPinnedMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  communityId: { type: "keyword", index: false },
  targetType: { type: "keyword", index: false },
  targetType_: { type: "keyword" },
  targetId: { type: "keyword", index: false },
  orderIndex: { type: "integer", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const communityAutomodSettingMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  communityId: { type: "keyword", index: false },
  rulesData: { type: "object", enabled: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};

const updateElasticIndexMappings = async () => {
  try {
    ElasticIndexer.addMapping("community", communityMapping);
    await new ElasticIndexer("community").updateMapping(communityMapping);
    ElasticIndexer.addMapping("communityMember", communityMemberMapping);
    await new ElasticIndexer("communityMember").updateMapping(
      communityMemberMapping,
    );
    ElasticIndexer.addMapping("communityRule", communityRuleMapping);
    await new ElasticIndexer("communityRule").updateMapping(
      communityRuleMapping,
    );
    ElasticIndexer.addMapping("communityPinned", communityPinnedMapping);
    await new ElasticIndexer("communityPinned").updateMapping(
      communityPinnedMapping,
    );
    ElasticIndexer.addMapping(
      "communityAutomodSetting",
      communityAutomodSettingMapping,
    );
    await new ElasticIndexer("communityAutomodSetting").updateMapping(
      communityAutomodSettingMapping,
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
