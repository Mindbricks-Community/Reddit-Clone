const { ElasticIndexer } = require("serviceCommon");
const { hexaLogger } = require("common");

const mediaObjectMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  ownerUserId: { type: "keyword", index: true },
  mediaType: { type: "keyword", index: true },
  mediaType_: { type: "keyword" },
  originalUrl: { type: "keyword", index: true },
  optimizedUrl: { type: "keyword", index: true },
  previewUrl: { type: "keyword", index: true },
  filename: { type: "keyword", index: false },
  fileSize: { type: "integer", index: false },
  status: { type: "keyword", index: true },
  status_: { type: "keyword" },
  nsfwScore: { type: "float", index: true },
  malwareStatus: { type: "keyword", index: true },
  malwareStatus_: { type: "keyword" },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const mediaScanMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  mediaObjectId: { type: "keyword", index: true },
  scanType: { type: "keyword", index: true },
  scanType_: { type: "keyword" },
  result: { properties: {} },
  scanStatus: { type: "keyword", index: true },
  scanStatus_: { type: "keyword" },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};

const updateElasticIndexMappings = async () => {
  try {
    ElasticIndexer.addMapping("mediaObject", mediaObjectMapping);
    await new ElasticIndexer("mediaObject").updateMapping(mediaObjectMapping);
    ElasticIndexer.addMapping("mediaScan", mediaScanMapping);
    await new ElasticIndexer("mediaScan").updateMapping(mediaScanMapping);
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
