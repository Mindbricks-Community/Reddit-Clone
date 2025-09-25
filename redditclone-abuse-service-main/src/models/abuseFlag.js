const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Flags set automatically (machine/mod heuristics or batch mod actions) for (potential) abusive behavior. Linked to post, comment, user, or media. Used for marking, filtering, forwarding to moderation, or auto-restriction.
const AbuseFlag = sequelize.define(
  "abuseFlag",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    flagType: {
      // Type of flag (spam, nsfw, ban-evasion, rate-abuse, suspicious, malware, automodCustom, other).
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "spam",
    },
    flagStatus: {
      // Status of the flag (active, reviewed, dismissed, escalated, resolved, suppressed).
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
    },
    postId: {
      // Flagged post (optional, mutually exclusive with commentId, userId, mediaObjectId).
      type: DataTypes.UUID,
      allowNull: true,
    },
    commentId: {
      // Flagged comment (optional, mutually exclusive with postId, userId, mediaObjectId).
      type: DataTypes.UUID,
      allowNull: true,
    },
    userId: {
      // Flagged user (optional, mutually exclusive).
      type: DataTypes.UUID,
      allowNull: true,
    },
    mediaObjectId: {
      // Flagged media object (optional, for NSFW/malware/other).
      type: DataTypes.UUID,
      allowNull: true,
    },
    origin: {
      // What set this flag: automod, rate-limiter, modtool, admin, external.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "automod",
    },
    details: {
      // Flexible field for context such as reason, scores, automod pattern, IP data, evidence, timestamps, etc.
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
        fields: ["postId"],
      },
      {
        unique: false,
        fields: ["commentId"],
      },
      {
        unique: false,
        fields: ["userId"],
      },
      {
        unique: false,
        fields: ["mediaObjectId"],
      },

      {
        unique: true,
        fields: ["flagType", "postId", "commentId", "userId", "mediaObjectId"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = AbuseFlag;
