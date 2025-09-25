const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Configurable automoderator rules and settings for each community; triggers for keyword/content/pattern-based moderation.
const CommunityAutomodSetting = sequelize.define(
  "communityAutomodSetting",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    communityId: {
      // Community this automod setting applies to.
      type: DataTypes.UUID,
      allowNull: false,
    },
    rulesData: {
      // JSON-structured data for all automod rules, triggers, and config for the community.
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: "{}",
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
        unique: true,
        fields: ["communityId"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = CommunityAutomodSetting;
