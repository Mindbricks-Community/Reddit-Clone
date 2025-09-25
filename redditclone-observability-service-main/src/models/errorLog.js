const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Captures application/system/business errors and warnings reported by all services. Includes context, severity, stack trace, and source metadata for audit/search/compliance.
const ErrorLog = sequelize.define(
  "errorLog",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    timestamp: {
      // When the error was recorded.
      type: DataTypes.DATE,
      allowNull: false,
    },
    serviceName: {
      // Name of service/component reporting error.
      type: DataTypes.STRING,
      allowNull: false,
    },
    errorType: {
      // Error or exception type/class.
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      // Error message or summary.
      type: DataTypes.TEXT,
      allowNull: false,
    },
    severity: {
      // Severity/level (fatal, error, warn, info, debug).
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "warn",
    },
    stackTrace: {
      // Error stack trace, if any (as string).
      type: DataTypes.TEXT,
      allowNull: true,
    },
    context: {
      // Flexible JSON: additional error context (route, params, user agent, custom fields).
      type: DataTypes.JSONB,
      allowNull: true,
    },
    userId: {
      // User ID if the error context involved a user action.
      type: DataTypes.UUID,
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
        fields: ["timestamp"],
      },
      {
        unique: false,
        fields: ["serviceName"],
      },
      {
        unique: false,
        fields: ["errorType"],
      },
      {
        unique: false,
        fields: ["severity"],
      },

      {
        unique: true,
        fields: ["timestamp", "serviceName", "errorType"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = ErrorLog;
