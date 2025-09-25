const { ElasticIndexer } = require("serviceCommon");
const { hexaLogger } = require("common");

const postMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  communityId: { type: "keyword", index: true },
  userId: { type: "keyword", index: true },
  title: { type: "keyword", index: true },
  bodyText: { type: "text", index: true },
  externalUrl: { type: "keyword", index: true },
  postType: { type: "keyword", index: true },
  postType_: { type: "keyword" },
  status: { type: "keyword", index: true },
  status_: { type: "keyword" },
  isNsfw: { type: "boolean", null_value: false },
  upVotes: { type: "integer", index: true },
  downVotes: { type: "integer", index: true },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const commentMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  postId: { type: "keyword", index: true },
  userId: { type: "keyword", index: true },
  parentCommentId: { type: "keyword", index: true },
  threadPath: { type: "keyword", index: false },
  bodyText: { type: "text", index: true },
  status: { type: "keyword", index: true },
  status_: { type: "keyword" },
  isNsfw: { type: "boolean", null_value: false },
  upVotes: { type: "integer", index: false },
  downVotes: { type: "integer", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const voteMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  userId: { type: "keyword", index: false },
  postId: { type: "keyword", index: false },
  commentId: { type: "keyword", index: false },
  voteType: { type: "keyword", index: false },
  voteType_: { type: "keyword" },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const pollOptionMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  postId: { type: "keyword", index: false },
  optionIndex: { type: "integer", index: false },
  optionText: { type: "keyword", index: false },
  voteCount: { type: "integer", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const postMediaMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  mediaObjectId: { type: "keyword", index: false },
  postId: { type: "keyword", index: false },
  commentId: { type: "keyword", index: false },
  mediaIndex: { type: "integer", index: false },
  caption: { type: "text", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};

const updateElasticIndexMappings = async () => {
  try {
    ElasticIndexer.addMapping("post", postMapping);
    await new ElasticIndexer("post").updateMapping(postMapping);
    ElasticIndexer.addMapping("comment", commentMapping);
    await new ElasticIndexer("comment").updateMapping(commentMapping);
    ElasticIndexer.addMapping("vote", voteMapping);
    await new ElasticIndexer("vote").updateMapping(voteMapping);
    ElasticIndexer.addMapping("pollOption", pollOptionMapping);
    await new ElasticIndexer("pollOption").updateMapping(pollOptionMapping);
    ElasticIndexer.addMapping("postMedia", postMediaMapping);
    await new ElasticIndexer("postMedia").updateMapping(postMediaMapping);
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
