const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//A message sent as part of a modmail thread; can be by a moderator or a user.
const ModmailMessage = sequelize.define(
  "modmailMessage",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    threadId: {
      // Reference to the parent modmail thread.
      type: DataTypes.UUID,
      allowNull: false,
    },
    senderUserId: {
      // User/moderator who sent this message.
      type: DataTypes.UUID,
      allowNull: false,
    },
    messageBody: {
      // Body of the modmail message.
      type: DataTypes.TEXT,
      allowNull: false,
    },
    messageType: {
      // Type of message: 0=user, 1=moderator, 2=system.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
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
        fields: ["threadId"],
      },
    ],
  },
);

module.exports = ModmailMessage;
