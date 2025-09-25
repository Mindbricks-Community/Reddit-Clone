const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//General-purpose compliance and operational audit log for system events such as config changes, admin activities, permission grants, etc.
const AuditLog = sequelize.define(
  "auditLog",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    timestamp: {
      // Time of audit event.
      type: DataTypes.DATE,
      allowNull: false,
    },
    eventType: {
      // Audit event type (adminAction, configChange, permissionGrant, authentication, etc).
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      // Actor (admin or user) performing the event (if any).
      type: DataTypes.UUID,
      allowNull: true,
    },
    message: {
      // Human-readable or system summary of audit log event.
      type: DataTypes.TEXT,
      allowNull: false,
    },
    targetType: {
      // Entity/subject affected (user, service, permission, etc).
      type: DataTypes.STRING,
      allowNull: true,
    },
    targetId: {
      // ID of target/subject (e.g. affected user, object).
      type: DataTypes.UUID,
      allowNull: true,
    },
    details: {
      // Additional audit context: JSON blob (fields vary by event).
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
        fields: ["timestamp"],
      },
      {
        unique: false,
        fields: ["eventType"],
      },
      {
        unique: false,
        fields: ["userId"],
      },

      {
        unique: true,
        fields: ["timestamp", "eventType"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = AuditLog;
