const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Logs platform-level administrative actions taken by admins (e.g., user ban, content removal, compliance actions) for audit and compliance purposes.
const AdminUserAction = sequelize.define(
  "adminUserAction",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    adminId: {
      // ID of the admin who performed the action
      type: DataTypes.UUID,
      allowNull: false,
    },
    targetType: {
      // Type of entity targeted: user, post, comment, other
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
    },
    targetId: {
      // ID of the entity acted upon (userId, postId, or commentId, according to targetType)
      type: DataTypes.UUID,
      allowNull: false,
    },
    actionType: {
      // Type of admin action (ban, unban, suspend, warn, removeContent, unlock, export, deleteAccount, overrideRestriction, other)
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ban",
    },
    reason: {
      // Short public reason for admin action
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      // Detailed private notes about the action (visible to admins only)
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
    indexes: [],
  },
);

module.exports = AdminUserAction;
