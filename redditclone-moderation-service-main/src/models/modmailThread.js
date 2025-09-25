const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Represents a modmail conversation thread between moderators and a user (or group, if extended). Thread is logical envelope for messages.
const ModmailThread = sequelize.define(
  "modmailThread",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    communityId: {
      // Community in which modmail is scoped.
      type: DataTypes.UUID,
      allowNull: false,
    },
    subject: {
      // Subject line of the thread.
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdByUserId: {
      // User (or moderator) who created the thread.
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      // Status of the thread: 0=open, 1=resolved, 2=archived, 3=deleted.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "open",
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

module.exports = ModmailThread;
