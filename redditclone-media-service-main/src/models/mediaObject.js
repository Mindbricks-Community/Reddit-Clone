const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Represents a user-uploaded media asset (image, video, gif, document, etc.). Stores metadata, ownership, processing and scan status, storage and delivery URLs.
const MediaObject = sequelize.define(
  "mediaObject",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    ownerUserId: {
      // ID of the user who uploaded/owns this media file.
      type: DataTypes.UUID,
      allowNull: false,
    },
    mediaType: {
      // Type of media: image, video, gif, document, audio, unknown.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "image",
    },
    originalUrl: {
      // URL/path to the original uploaded file.
      type: DataTypes.STRING,
      allowNull: false,
    },
    optimizedUrl: {
      // URL/path to the optimized/processed version (e.g., compressed, transcoded, resized).
      type: DataTypes.STRING,
      allowNull: true,
    },
    previewUrl: {
      // URL/path to the preview image (thumbnail or short preview for video).
      type: DataTypes.STRING,
      allowNull: true,
    },
    filename: {
      // Original filename as uploaded by the user.
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileSize: {
      // Size of the uploaded file in bytes.
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    status: {
      // Processing/state status: 0=pending, 1=ready, 2=failed, 3=quarantined, 4=deleted.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
    nsfwScore: {
      // Latest NSFW probability/score (0-1); threshold can be used by clients for filtering.
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    malwareStatus: {
      // Malware scan result: 0=unknown, 1=clean, 2=flagged, 3=infected.
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "unknown",
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
        fields: ["ownerUserId"],
      },
      {
        unique: false,
        fields: ["status"],
      },
    ],
  },
);

module.exports = MediaObject;
