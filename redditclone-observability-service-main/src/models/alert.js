const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Tracks active or resolved alerts about incidents impacting reliability, SLO/SLA, or other central system signals. Alerts link to sloEvents and errorLogs as needed.
const Alert = sequelize.define(
  "alert",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    title: {
      // Short summary/title of the alert.
      type: DataTypes.STRING,
      allowNull: false,
    },
    affectedServices: {
      // Array of service names affected by this alert/incident.
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: "[]",
    },
    status: {
      // Current status of alert (open, acknowledged, resolved, closed, suppressed).
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "open",
    },
    severity: {
      // Severity level (critical, high, medium, low, info).
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "high",
    },
    sloEventIds: {
      // Array of sloEvent ids linked to this alert.
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
      defaultValue: "[]",
    },
    errorLogIds: {
      // Array of errorLog ids linked to this alert.
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
      defaultValue: "[]",
    },
    resolvedByUserId: {
      // User that acknowledged/resolved/closed this alert.
      type: DataTypes.UUID,
      allowNull: true,
    },
    notes: {
      // Alert notes, resolution, or response timeline.
      type: DataTypes.TEXT,
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
        fields: ["title"],
      },
      {
        unique: false,
        fields: ["status"],
      },
      {
        unique: false,
        fields: ["severity"],
      },

      {
        unique: true,
        fields: ["createdAt", "status", "severity"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = Alert;
