const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Tracks anti-abuse/anti-spam system events: rate limits exceeded, spam/harassment heuristics, bulk/flooding events. Can be used for real-time throttling or investigation.
const AbuseHeuristicTrigger = sequelize.define(
  "abuseHeuristicTrigger",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    triggerType: {
      // Kind of trigger: rate-exceeded, flood attempt, spam, abusePhrase, botSuspect, multiAccount, rapidVote, other.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "rateExceeded",
    },
    userId: {
      // Affected or triggering user (if any, e.g. rate limited).
      type: DataTypes.UUID,
      allowNull: true,
    },
    ipAddress: {
      // Source IP address/origination (for rate limits, bot detection, etc).
      type: DataTypes.STRING,
      allowNull: true,
    },
    targetId: {
      // ID of post/comment/content/other entity if relevant.
      type: DataTypes.UUID,
      allowNull: true,
    },
    details: {
      // Flexible metadata (why, how many attempts, evidence, automod pattern, query params, timing, etc).
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
        fields: ["userId"],
      },
      {
        unique: false,
        fields: ["ipAddress"],
      },

      {
        unique: true,
        fields: ["userId", "ipAddress", "triggerType"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = AbuseHeuristicTrigger;
