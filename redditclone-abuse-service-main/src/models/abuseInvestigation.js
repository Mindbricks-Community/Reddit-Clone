const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Tracks ongoing investigations performed by mods/admins on potential abuse cases (spam rings, coordinated attacks, large-scale harassment, etc) for documentation and escalation.
const AbuseInvestigation = sequelize.define(
  "abuseInvestigation",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    investigationStatus: {
      // Status of investigation (open, inProgress, closed, escalated, dismissed, duplicate)
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "open",
    },
    title: {
      // Short title or summary describing the investigation topic.
      type: DataTypes.STRING,
      allowNull: false,
    },
    openedByUserId: {
      // Moderator/admin user who opened the investigation.
      type: DataTypes.UUID,
      allowNull: false,
    },
    assignedToUserIds: {
      // Array of IDs of mods/admins currently active on the investigation.
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
    },
    relatedReportIds: {
      // Array of abuseReport ids this investigation covers.
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
    },
    relatedFlagIds: {
      // Array of abuseFlag ids handled in this investigation.
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
    },
    details: {
      // Flexible details/log field (timeline, findings, next actions, etc).
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
        unique: true,
        fields: ["openedByUserId", "investigationStatus"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = AbuseInvestigation;
