const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Tracks the user&#39;s membership/role in a community, including join status and granular role assignment (e.g., member, moderator, admin).
const CommunityMember = sequelize.define(
  "communityMember",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    communityId: {
      // Reference to the community.
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      // Reference to the user.
      type: DataTypes.UUID,
      allowNull: false,
    },
    role: {
      // Member role: 0=Member, 1=Moderator, 2=Admin (community-specific admin).
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "member",
    },
    status: {
      // Invite and join status: 0=active, 1=pending, 2=banned, 3=invite_sent, 4=removed.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
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
      {
        unique: false,
        fields: ["userId"],
      },

      {
        unique: true,
        fields: ["communityId", "userId"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = CommunityMember;
