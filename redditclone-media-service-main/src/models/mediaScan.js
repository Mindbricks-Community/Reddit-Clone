const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Represents a scan operation performed on a specific mediaObject (e.g., at upload or on-demand re-scan). Records type, results, and details for audit/history.
const MediaScan = sequelize.define(
  "mediaScan",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    mediaObjectId: {
      // Reference to the mediaObject scanned.
      type: DataTypes.UUID,
      allowNull: false,
    },
    scanType: {
      // Type of scan performed: 0=nsfw, 1=malware, 2=other, 3=combined.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "nsfw",
    },
    result: {
      // JSON-formatted scan result details: e.g., {nsfwScore:0.98, categories:['drawing','hentai']}, or malware: {clean:true,signature:'EICAR'}
      type: DataTypes.JSONB,
      allowNull: false,
    },
    scanStatus: {
      // Scan record status: 0=pending, 1=success, 2=failed.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
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
    ],
  },
);

module.exports = MediaScan;
