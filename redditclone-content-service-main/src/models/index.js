const { DataTypes } = require("sequelize");
const { getEnumValue } = require("serviceCommon");
const { ElasticIndexer } = require("serviceCommon");
const updateElasticIndexMappings = require("./elastic-index");
const { hexaLogger } = require("common");

const Post = require("./post");
const Comment = require("./comment");
const Vote = require("./vote");
const PollOption = require("./pollOption");
const PostMedia = require("./postMedia");

Post.prototype.getData = function () {
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
  const postTypeOptions = ["text", "link", "image", "video", "gallery", "poll"];
  const dataTypepostTypePost = typeof data.postType;
  const enumIndexpostTypePost =
    dataTypepostTypePost === "string"
      ? postTypeOptions.indexOf(data.postType)
      : data.postType;
  data.postType_idx = enumIndexpostTypePost;
  data.postType =
    enumIndexpostTypePost > -1
      ? postTypeOptions[enumIndexpostTypePost]
      : undefined;
  // set enum Index and enum value
  const statusOptions = ["active", "deleted", "locked", "removed"];
  const dataTypestatusPost = typeof data.status;
  const enumIndexstatusPost =
    dataTypestatusPost === "string"
      ? statusOptions.indexOf(data.status)
      : data.status;
  data.status_idx = enumIndexstatusPost;
  data.status =
    enumIndexstatusPost > -1 ? statusOptions[enumIndexstatusPost] : undefined;

  data._owner = data.userId ?? undefined;
  return data;
};

Comment.prototype.getData = function () {
  const data = this.dataValues;

  data.commentOnPost = this.commentOnPost
    ? this.commentOnPost.getData()
    : undefined;
  data.parentComment = this.parentComment
    ? this.parentComment.getData()
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
  const statusOptions = ["active", "deleted", "removed"];
  const dataTypestatusComment = typeof data.status;
  const enumIndexstatusComment =
    dataTypestatusComment === "string"
      ? statusOptions.indexOf(data.status)
      : data.status;
  data.status_idx = enumIndexstatusComment;
  data.status =
    enumIndexstatusComment > -1
      ? statusOptions[enumIndexstatusComment]
      : undefined;

  data._owner = data.userId ?? undefined;
  return data;
};

Comment.belongsTo(Post, {
  as: "commentOnPost",
  foreignKey: "postId",
  targetKey: "id",
  constraints: false,
});

Comment.belongsTo(Comment, {
  as: "parentComment",
  foreignKey: "parentCommentId",
  targetKey: "id",
  constraints: false,
});

Vote.prototype.getData = function () {
  const data = this.dataValues;

  data.voteForPost = this.voteForPost ? this.voteForPost.getData() : undefined;
  data.voteForComment = this.voteForComment
    ? this.voteForComment.getData()
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
  const voteTypeOptions = ["none", "upvote", "downvote"];
  const dataTypevoteTypeVote = typeof data.voteType;
  const enumIndexvoteTypeVote =
    dataTypevoteTypeVote === "string"
      ? voteTypeOptions.indexOf(data.voteType)
      : data.voteType;
  data.voteType_idx = enumIndexvoteTypeVote;
  data.voteType =
    enumIndexvoteTypeVote > -1
      ? voteTypeOptions[enumIndexvoteTypeVote]
      : undefined;

  data._owner = data.userId ?? undefined;
  return data;
};

Vote.belongsTo(Post, {
  as: "voteForPost",
  foreignKey: "postId",
  targetKey: "id",
  constraints: false,
});

Vote.belongsTo(Comment, {
  as: "voteForComment",
  foreignKey: "commentId",
  targetKey: "id",
  constraints: false,
});

PollOption.prototype.getData = function () {
  const data = this.dataValues;

  data.pollForPost = this.pollForPost ? this.pollForPost.getData() : undefined;

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

PollOption.belongsTo(Post, {
  as: "pollForPost",
  foreignKey: "postId",
  targetKey: "id",
  constraints: false,
});

PostMedia.prototype.getData = function () {
  const data = this.dataValues;

  data.mediaForPost = this.mediaForPost
    ? this.mediaForPost.getData()
    : undefined;
  data.mediaForComment = this.mediaForComment
    ? this.mediaForComment.getData()
    : undefined;

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

PostMedia.belongsTo(Post, {
  as: "mediaForPost",
  foreignKey: "postId",
  targetKey: "id",
  constraints: false,
});

PostMedia.belongsTo(Comment, {
  as: "mediaForComment",
  foreignKey: "commentId",
  targetKey: "id",
  constraints: false,
});

module.exports = {
  Post,
  Comment,
  Vote,
  PollOption,
  PostMedia,
  updateElasticIndexMappings,
};
