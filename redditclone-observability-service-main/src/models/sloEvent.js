const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Represents a service-level SLO/SLA event (breach, recovery, ongoing issue). Includes status, incident type, affected services, and resolution notes.
const SloEvent = sequelize.define(
  "sloEvent",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    eventTime: {
      // Time when the (breach, recovery, etc) event was detected.
      type: DataTypes.DATE,
      allowNull: false,
    },
    serviceName: {
      // Service/component name affected.
      type: DataTypes.STRING,
      allowNull: false,
    },
    eventType: {
      // Event type (breach, slow, outage, recovery, maintenance, incident, other).
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "breach",
    },
    status: {
      // Current status (open, resolved, inProgress, closed).
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "open",
    },
    notes: {
      // Event notes, outage details/resolution steps.
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
        fields: ["eventTime"],
      },
      {
        unique: false,
        fields: ["serviceName"],
      },
      {
        unique: false,
        fields: ["eventType"],
      },
      {
        unique: false,
        fields: ["status"],
      },

      {
        unique: true,
        fields: ["serviceName", "eventType", "eventTime"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = SloEvent;
