const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Tracks users globally banned, suspended, or shadowbanned at platform level (not per community).
const GlobalUserRestriction = sequelize.define(
  "globalUserRestriction",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    userId: {
      // User ID being restricted
      type: DataTypes.UUID,
      allowNull: false,
    },
    restrictionType: {
      // Restriction type: ban, suspend, shadowban
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ban",
    },
    status: {
      // Status of restriction: active, revoked, expired
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
    },
    startDate: {
      // Start time of restriction (UTC)
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      // End time of restriction (UTC, null if indefinite)
      type: DataTypes.DATE,
      allowNull: true,
    },
    reason: {
      // Public reason for restriction
      type: DataTypes.STRING,
      allowNull: true,
    },
    adminId: {
      // Admin ID who issued/revoked the restriction
      type: DataTypes.UUID,
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
        unique: true,
        fields: ["userId"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = GlobalUserRestriction;
