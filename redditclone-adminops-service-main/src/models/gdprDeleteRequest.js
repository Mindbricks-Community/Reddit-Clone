const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Tracks and manages user data/account erasure requests for GDPR compliance (user or admin-initiated).
const GdprDeleteRequest = sequelize.define(
  "gdprDeleteRequest",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    userId: {
      // ID of the user whose data/account deletion is requested
      type: DataTypes.UUID,
      allowNull: false,
    },
    requestedByAdminId: {
      // ID of admin who initiated the deletion (null if user-initiated)
      type: DataTypes.UUID,
      allowNull: true,
    },
    status: {
      // Status of delete request: pending, processing, completed, failed, canceled
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
    errorMsg: {
      // Failure details (if status=failed or canceled)
      type: DataTypes.STRING,
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

module.exports = GdprDeleteRequest;
