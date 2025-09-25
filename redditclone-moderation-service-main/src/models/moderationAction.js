const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Records each manual moderation action (approve, remove, lock, warn, temp-ban, etc.) performed on a post, comment, or user within a community for audit and workflow.
const ModerationAction = sequelize.define(
  "moderationAction",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    communityId: {
      // Target community where the moderation action takes place.
      type: DataTypes.UUID,
      allowNull: false,
    },
    targetType: {
      // Target type: 0=post, 1=comment, 2=user.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "post",
    },
    targetId: {
      // ID of the entity (post, comment, or user) on which action is performed.
      type: DataTypes.UUID,
      allowNull: false,
    },
    actionType: {
      // Action taken: 0=approve, 1=remove, 2=lock, 3=unlock, 4=warn, 5=temp-ban, 6=perm-ban, 7=unban, 8=bulk-remove, 9=bulk-approve, 10=note.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "approve",
    },
    performedByUserId: {
      // ID of the moderator who performed the action.
      type: DataTypes.UUID,
      allowNull: false,
    },
    performedByRole: {
      // Role of actor: 0=moderator, 1=admin (community-level or platform admin).
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "moderator",
    },
    reason: {
      // Short text reason provided by the moderator (public explanation).
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      // Optional detailed moderator notes (private, not shown to user).
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
        fields: ["communityId"],
      },
    ],
  },
);

module.exports = ModerationAction;
