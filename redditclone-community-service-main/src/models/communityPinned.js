const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//A post, rule, or announcement pinned to the top/front of a community.
const CommunityPinned = sequelize.define(
  "communityPinned",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    communityId: {
      // Community this pinned item is for.
      type: DataTypes.UUID,
      allowNull: false,
    },
    targetType: {
      // Type of pinned item: 0=post, 1=rule, 2=announcement.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "post",
    },
    targetId: {
      // ID of the post, rule, or announcement that is pinned.
      type: DataTypes.UUID,
      allowNull: false,
    },
    orderIndex: {
      // Ordering for display among pinned items.
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
        fields: ["targetId"],
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

module.exports = CommunityPinned;
