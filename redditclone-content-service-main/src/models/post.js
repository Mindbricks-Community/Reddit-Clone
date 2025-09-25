const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//A user-created content submission to a community. Supports formats: text, link, image, video, gallery, poll. Includes metadata, status, voting tallies, filtering, and media references.
const Post = sequelize.define(
  "post",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    communityId: {
      // Community to which the post belongs.
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      // User who created this post.
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      // Title of the post. Required except for image/gallery-only posts.
      type: DataTypes.STRING,
      allowNull: true,
    },
    bodyText: {
      // Text content of the post. Required for text posts; optional for others.
      type: DataTypes.TEXT,
      allowNull: true,
    },
    externalUrl: {
      // Target URL for link posts (YouTube, news, etc).
      type: DataTypes.STRING,
      allowNull: true,
    },
    postType: {
      // Type of post: text, link, image, video, gallery, poll.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "text",
    },
    status: {
      // Post status: active (0), deleted (1), locked (2), removed(3).
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
    },
    isNsfw: {
      // Whether the post is marked NSFW.
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    upVotes: {
      // Cached number of upvotes for the post.
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    downVotes: {
      // Cached number of downvotes for the post.
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
        fields: ["communityId"],
      },
      {
        unique: false,
        fields: ["userId"],
      },
      {
        unique: false,
        fields: ["status"],
      },

      {
        unique: true,
        fields: ["communityId", "status"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = Post;
