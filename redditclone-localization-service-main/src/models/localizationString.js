const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Stores a translation of a localizationKey for a particular locale. Includes translation content, status, and metadata.
const LocalizationString = sequelize.define(
  "localizationString",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    keyId: {
      // The ID of the localizationKey this string translates.
      type: DataTypes.UUID,
      allowNull: false,
    },
    localeId: {
      // The ID of the locale for which this string is the translation.
      type: DataTypes.UUID,
      allowNull: false,
    },
    value: {
      // The actual translated string content.
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      // Status of the translation: 0=pending, 1=inReview, 2=approved.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
    reviewNotes: {
      // Optional notes for translators or reviewers on this translation.
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
        fields: ["keyId"],
      },
      {
        unique: false,
        fields: ["localeId"],
      },

      {
        unique: true,
        fields: ["keyId", "localeId"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = LocalizationString;
