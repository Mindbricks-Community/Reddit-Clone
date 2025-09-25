const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Singleton object for sitewide compliance/configuration options (e.g., minimum age, GDPR export/erase policy).
const CompliancePolicy = sequelize.define(
  "compliancePolicy",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    minAge: {
      // Minimum allowed user age (in years)
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 13,
    },
    gdprExportEnabled: {
      // Sitewide toggle for GDPR data export availability
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    gdprDeleteEnabled: {
      // Sitewide toggle for GDPR delete/erasure availability
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
    indexes: [],
  },
);

module.exports = CompliancePolicy;
