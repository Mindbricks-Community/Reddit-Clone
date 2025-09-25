const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//A unique translatable key for platform strings/messages. Includes UI usage context and default English text.
const LocalizationKey = sequelize.define(
  "localizationKey",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    uiKey: {
      // Unique key for string/message (e.g. app.feed.title, buttons.submit).
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      // Explanation/context for translators or devs (e.g. where used in UI).
      type: DataTypes.TEXT,
      allowNull: true,
    },
    defaultValue: {
      // Default (English) string for this key.
      type: DataTypes.TEXT,
      allowNull: false,
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
        fields: ["uiKey"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = LocalizationKey;
