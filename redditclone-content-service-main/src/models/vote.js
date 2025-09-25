const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Tracks upvote/downvote by user on a post or a comment. Used to prevent duplicate voting and aggregate score.
const Vote = sequelize.define(
  "vote",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    userId: {
      // User who cast the vote.
      type: DataTypes.UUID,
      allowNull: false,
    },
    postId: {
      // Post that receives the vote (nullable if for comment).
      type: DataTypes.UUID,
      allowNull: true,
    },
    commentId: {
      // Comment that receives the vote (nullable if for post).
      type: DataTypes.UUID,
      allowNull: true,
    },
    voteType: {
      // Direction/type of the vote. 0=none (neutral), 1=upvote, 2=downvote.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "none",
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
        fields: ["userId"],
      },
      {
        unique: false,
        fields: ["postId"],
      },
      {
        unique: false,
        fields: ["commentId"],
      },

      {
        unique: true,
        fields: ["userId", "postId"],
        where: { isActive: true },
      },
      {
        unique: true,
        fields: ["userId", "commentId"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = Vote;
