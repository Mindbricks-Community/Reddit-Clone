const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//A comment or threaded reply on a post. Supports parent-child replies (threading), text, voting, nsfw, deleted/removed status.
const Comment = sequelize.define(
  "comment",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    postId: {
      // Parent post to which this comment belongs.
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      // User who wrote this comment.
      type: DataTypes.UUID,
      allowNull: false,
    },
    parentCommentId: {
      // Parent comment for threaded replies. Null if top-level comment.
      type: DataTypes.UUID,
      allowNull: true,
    },
    threadPath: {
      // Path string representing the threaded ancestry of this comment (for efficient thread queries).
      type: DataTypes.STRING,
      allowNull: true,
    },
    bodyText: {
      // Content of the comment.
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      // Comment status: active(0), deleted(1), removed(2).
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
    },
    isNsfw: {
      // Mark comment as NSFW.
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    upVotes: {
      // Cached upvote count for the comment.
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    downVotes: {
      // Cached downvote count for the comment.
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isActive: {
      // isActive property will be set to false when deleted
      // so that the document will be archived
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ["postId"],
      },
      {
        unique: false,
        fields: ["userId"],
      },
      {
        unique: false,
        fields: ["parentCommentId"],
      },
      {
        unique: false,
        fields: ["status"],
      },

      {
        unique: true,
        fields: ["postId", "parentCommentId", "status"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = Comment;
