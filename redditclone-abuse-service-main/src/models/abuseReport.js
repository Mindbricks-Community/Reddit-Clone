const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Tracks each instance where a user or automated system reports abuse, spam, policy violation, or problematic behavior on a post, comment, or user. Includes reporter, reason, target links, status, result, and moderation review info.
const AbuseReport = sequelize.define(
  "abuseReport",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    reportType: {
      // Type of abuse being reported: spam, harassment, rules, nsfw, other.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "spam",
    },
    reportStatus: {
      // Current status: new/queued, under_review, forwarded, resolved, dismissed, invalid.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "new",
    },
    reasonText: {
      // User-provided or system-generated explanation for report.
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reporterUserId: {
      // User who initiated the report.
      type: DataTypes.UUID,
      allowNull: false,
    },
    reportedUserId: {
      // User being reported (directly or as post/comment author).
      type: DataTypes.UUID,
      allowNull: true,
    },
    postId: {
      // ID of the reported post (if applicable).
      type: DataTypes.UUID,
      allowNull: true,
    },
    commentId: {
      // ID of the reported comment (if applicable).
      type: DataTypes.UUID,
      allowNull: true,
    },
    origin: {
      // Was report user-initiated/manual, automod, or external integration?
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
    },
    resolutionResult: {
      // Outcome: content actioned (removed...), dismissed, after mod/admin review. Null if unresolved.
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "none",
    },
    resolvedByUserId: {
      // Moderator/admin/automod (user)ID who resolved the report.
      type: DataTypes.UUID,
      allowNull: true,
    },
    extraData: {
      // Flexible JSON for custom keys: browser, source IP, additional evidence, or attachment refs for mod workflow.
      type: DataTypes.JSONB,
      allowNull: true,
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
        fields: ["reporterUserId"],
      },
      {
        unique: false,
        fields: ["reportedUserId"],
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
        fields: ["reportedUserId", "postId", "commentId", "reporterUserId"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = AbuseReport;
