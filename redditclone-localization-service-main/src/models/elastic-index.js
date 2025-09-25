const { ElasticIndexer } = require("serviceCommon");
const { hexaLogger } = require("common");

const localeMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  localeCode: { type: "keyword", index: true },
  displayName: { type: "keyword", index: true },
  direction: { type: "keyword", index: false },
  direction_: { type: "keyword" },
  enabled: { type: "boolean", null_value: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const localizationKeyMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  uiKey: { type: "keyword", index: true },
  description: { type: "text", index: true },
  defaultValue: { type: "text", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const localizationStringMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  keyId: { type: "keyword", index: true },
  localeId: { type: "keyword", index: true },
  value: { type: "text", index: true },
  status: { type: "keyword", index: true },
  status_: { type: "keyword" },
  reviewNotes: { type: "text", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};

const updateElasticIndexMappings = async () => {
  try {
    ElasticIndexer.addMapping("locale", localeMapping);
    await new ElasticIndexer("locale").updateMapping(localeMapping);
    ElasticIndexer.addMapping("localizationKey", localizationKeyMapping);
    await new ElasticIndexer("localizationKey").updateMapping(
      localizationKeyMapping,
    );
    ElasticIndexer.addMapping("localizationString", localizationStringMapping);
    await new ElasticIndexer("localizationString").updateMapping(
      localizationStringMapping,
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
