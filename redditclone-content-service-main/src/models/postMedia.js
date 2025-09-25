const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Associates media (images/videos) to a post or comment, allowing galleries and ordering. Media is owned by media service, this is the cross-ref with ordering/meta.
const PostMedia = sequelize.define(
  "postMedia",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    mediaObjectId: {
      // ID of media object stored in media service.
      type: DataTypes.UUID,
      allowNull: false,
    },
    postId: {
      // Referencing post, if any.
      type: DataTypes.UUID,
      allowNull: true,
    },
    commentId: {
      // Referencing comment, if any.
      type: DataTypes.UUID,
      allowNull: true,
    },
    mediaIndex: {
      // Order for display in gallery/media list.
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    caption: {
      // Optional caption/description for this media instance in the post or comment.
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
        fields: ["mediaObjectId"],
      },
      {
        unique: false,
        fields: ["postId"],
      },
      {
        unique: false,
        fields: ["commentId"],
      },

      {
        unique: true,
        fields: ["mediaObjectId", "postId", "commentId"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = PostMedia;
