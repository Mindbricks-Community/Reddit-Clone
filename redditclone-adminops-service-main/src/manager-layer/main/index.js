module.exports = {
  // main Database Crud Object Routes Manager Layer Classes
  // AdminUserAction Db Object
  GetAdminUserActionManager: require("./adminUserAction/get-adminuseraction"),
  CreateAdminUserActionManager: require("./adminUserAction/create-adminuseraction"),
  UpdateAdminUserActionManager: require("./adminUserAction/update-adminuseraction"),
  DeleteAdminUserActionManager: require("./adminUserAction/delete-adminuseraction"),
  ListAdminUserActionsManager: require("./adminUserAction/list-adminuseractions"),
  // GdprExportRequest Db Object
  GetGdprExportRequestManager: require("./gdprExportRequest/get-gdprexportrequest"),
  CreateGdprExportRequestManager: require("./gdprExportRequest/create-gdprexportrequest"),
  UpdateGdprExportRequestManager: require("./gdprExportRequest/update-gdprexportrequest"),
  DeleteGdprExportRequestManager: require("./gdprExportRequest/delete-gdprexportrequest"),
  ListGdprExportRequestsManager: require("./gdprExportRequest/list-gdprexportrequests"),
  // GdprDeleteRequest Db Object
  GetGdprDeleteRequestManager: require("./gdprDeleteRequest/get-gdprdeleterequest"),
  CreateGdprDeleteRequestManager: require("./gdprDeleteRequest/create-gdprdeleterequest"),
  UpdateGdprDeleteRequestManager: require("./gdprDeleteRequest/update-gdprdeleterequest"),
  DeleteGdprDeleteRequestManager: require("./gdprDeleteRequest/delete-gdprdeleterequest"),
  ListGdprDeleteRequestsManager: require("./gdprDeleteRequest/list-gdprdeleterequests"),
  // CompliancePolicy Db Object
  GetCompliancePolicyManager: require("./compliancePolicy/get-compliancepolicy"),
  CreateCompliancePolicyManager: require("./compliancePolicy/create-compliancepolicy"),
  UpdateCompliancePolicyManager: require("./compliancePolicy/update-compliancepolicy"),
  DeleteCompliancePolicyManager: require("./compliancePolicy/delete-compliancepolicy"),
  ListCompliancePoliciesManager: require("./compliancePolicy/list-compliancepolicies"),
  // GlobalUserRestriction Db Object
  GetGlobalUserRestrictionManager: require("./globalUserRestriction/get-globaluserrestriction"),
  CreateGlobalUserRestrictionManager: require("./globalUserRestriction/create-globaluserrestriction"),
  UpdateGlobalUserRestrictionManager: require("./globalUserRestriction/update-globaluserrestriction"),
  DeleteGlobalUserRestrictionManager: require("./globalUserRestriction/delete-globaluserrestriction"),
  ListGlobalUserRestrictionsManager: require("./globalUserRestriction/list-globaluserrestrictions"),
};
