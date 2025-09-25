const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Complete audit log of all moderation and automod events, including manual actions, automated actions, and source context.
const ModerationAuditLog = sequelize.define(
  "moderationAuditLog",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    logEntryType: {
      // Type of log entry: 0=moderationAction, 1=automodEvent, 2=reportLinked, 3=bulkAction.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "moderationAction",
    },
    communityId: {
      // Community context of the log entry.
      type: DataTypes.UUID,
      allowNull: false,
    },
    entityType: {
      // Entity type the log references: 0=post, 1=comment, 2=user, 3=other.
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "other",
    },
    entityId: {
      // ID of the referenced post/comment/user/object.
      type: DataTypes.UUID,
      allowNull: true,
    },
    actionUserId: {
      // ID of the actor (moderator/admin/user/automod).
      type: DataTypes.UUID,
      allowNull: true,
    },
    linkedModerationActionId: {
      // If this log is tied to a specific moderationAction entry.
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
        unique: false,
        fields: ["communityId"],
      },
    ],
  },
);

module.exports = ModerationAuditLog;
