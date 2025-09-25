module.exports = (headers) => {
  // CompliancePolicy Db Object Rest Api Router
  const compliancePolicyMcpRouter = [];
  // getCompliancePolicy controller
  compliancePolicyMcpRouter.push(require("./get-compliancepolicy")(headers));
  // createCompliancePolicy controller
  compliancePolicyMcpRouter.push(require("./create-compliancepolicy")(headers));
  // updateCompliancePolicy controller
  compliancePolicyMcpRouter.push(require("./update-compliancepolicy")(headers));
  // deleteCompliancePolicy controller
  compliancePolicyMcpRouter.push(require("./delete-compliancepolicy")(headers));
  // listCompliancePolicies controller
  compliancePolicyMcpRouter.push(require("./list-compliancepolicies")(headers));
  return compliancePolicyMcpRouter;
};
