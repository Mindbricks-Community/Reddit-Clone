const express = require("express");

// CompliancePolicy Db Object Rest Api Router
const compliancePolicyRouter = express.Router();

// add CompliancePolicy controllers

// getCompliancePolicy controller
compliancePolicyRouter.get(
  "/compliancepolicies/:compliancePolicyId",
  require("./get-compliancepolicy"),
);
// createCompliancePolicy controller
compliancePolicyRouter.post(
  "/compliancepolicies",
  require("./create-compliancepolicy"),
);
// updateCompliancePolicy controller
compliancePolicyRouter.patch(
  "/compliancepolicies/:compliancePolicyId",
  require("./update-compliancepolicy"),
);
// deleteCompliancePolicy controller
compliancePolicyRouter.delete(
  "/compliancepolicies/:compliancePolicyId",
  require("./delete-compliancepolicy"),
);
// listCompliancePolicies controller
compliancePolicyRouter.get(
  "/compliancepolicies",
  require("./list-compliancepolicies"),
);

module.exports = compliancePolicyRouter;
