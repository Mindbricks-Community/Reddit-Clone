const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Represents a supported language/locale for translations. Includes code (e.g., en-US), display name, direction, and enabled status.
const Locale = sequelize.define(
  "locale",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    localeCode: {
      // IETF language/region code, e.g., en, en-US, tr-TR.
      type: DataTypes.STRING,
      allowNull: false,
    },
    displayName: {
      // Localized name for this locale (e.g., English, Türkçe).
      type: DataTypes.STRING,
      allowNull: false,
    },
    direction: {
      // Text direction for the locale: 0=LTR, 1=RTL.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ltr",
    },
    enabled: {
      // Is this locale enabled and available for use?
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
        unique: true,
        fields: ["localeCode"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = Locale;
