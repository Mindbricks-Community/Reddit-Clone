const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Option available to vote on for a poll-type post. Each poll-type post may have multiple poll options.
const PollOption = sequelize.define(
  "pollOption",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    postId: {
      // Post (of type 'poll') this option belongs to.
      type: DataTypes.UUID,
      allowNull: false,
    },
    optionIndex: {
      // Index of this poll option (0-based).
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    optionText: {
      // Text/label for this poll option.
      type: DataTypes.STRING,
      allowNull: false,
    },
    voteCount: {
      // Cached number of votes for this option.
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
        fields: ["postId"],
      },
      {
        unique: false,
        fields: ["optionIndex"],
      },

      {
        unique: true,
        fields: ["postId", "optionIndex"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = PollOption;
