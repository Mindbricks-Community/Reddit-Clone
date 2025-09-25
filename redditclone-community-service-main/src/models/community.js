const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//A top-level user-created group for discussions, featuring configuration for privacy, allowed post types, appearance, rules, and trending/popularity tracking.
const Community = sequelize.define(
  "community",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    name: {
      // Community display name (must be unique and human readable).
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      // Unique identifier for URLs (e.g., r/mycommunity).
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      // Detailed description of the community's purpose and content.
      type: DataTypes.TEXT,
      allowNull: false,
    },
    creatorId: {
      // ID of the user who created the community.
      type: DataTypes.UUID,
      allowNull: false,
    },
    bannerUrl: {
      // Banner image URL for top of the community page.
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatarUrl: {
      // Logo or avatar image URL of the community.
      type: DataTypes.STRING,
      allowNull: true,
    },
    colorScheme: {
      // Customizable color theme (e.g., for branding the community page).
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "#FFFFFF",
    },
    privacyLevel: {
      // Privacy type: 0=public, 1=restricted (invite/key to post), 2=private.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "public",
    },
    isNsfw: {
      // Indicates if the community is designated NSFW or adult.
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    allowedPostTypes: {
      // Allowed content types (bit-enum): 0=text, 1=link, 2=image, 3=video, 4=gallery, 5=poll.
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: "[0,1,2,3,4,5]",
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
        fields: ["name"],
      },
      {
        unique: false,
        fields: ["creatorId"],
      },

      {
        unique: true,
        fields: ["slug"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = Community;
