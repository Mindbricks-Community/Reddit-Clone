const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//A rule or guideline defined by moderators of a community. Enforced by moderators and/or automod.
const CommunityRule = sequelize.define(
  "communityRule",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    communityId: {
      // Community this rule belongs to.
      type: DataTypes.UUID,
      allowNull: false,
    },
    shortName: {
      // Short display name for the rule.
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      // Detailed explanation of the rule.
      type: DataTypes.TEXT,
      allowNull: false,
    },
    orderIndex: {
      // Ordering/priority of the rule within its community.
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
        fields: ["orderIndex"],
      },

      {
        unique: true,
        fields: ["communityId", "orderIndex"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = CommunityRule;
