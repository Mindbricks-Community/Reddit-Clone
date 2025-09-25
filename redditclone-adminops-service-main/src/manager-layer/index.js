module.exports = {
  AdminOpsServiceManager: require("./service-manager/AdminOpsServiceManager"),
  // main Database Crud Object Routes Manager Layer Classes
  // AdminUserAction Db Object
  GetAdminUserActionManager: require("./main/adminUserAction/get-adminuseraction"),
  CreateAdminUserActionManager: require("./main/adminUserAction/create-adminuseraction"),
  UpdateAdminUserActionManager: require("./main/adminUserAction/update-adminuseraction"),
  DeleteAdminUserActionManager: require("./main/adminUserAction/delete-adminuseraction"),
  ListAdminUserActionsManager: require("./main/adminUserAction/list-adminuseractions"),
  // GdprExportRequest Db Object
  GetGdprExportRequestManager: require("./main/gdprExportRequest/get-gdprexportrequest"),
  CreateGdprExportRequestManager: require("./main/gdprExportRequest/create-gdprexportrequest"),
  UpdateGdprExportRequestManager: require("./main/gdprExportRequest/update-gdprexportrequest"),
  DeleteGdprExportRequestManager: require("./main/gdprExportRequest/delete-gdprexportrequest"),
  ListGdprExportRequestsManager: require("./main/gdprExportRequest/list-gdprexportrequests"),
  // GdprDeleteRequest Db Object
  GetGdprDeleteRequestManager: require("./main/gdprDeleteRequest/get-gdprdeleterequest"),
  CreateGdprDeleteRequestManager: require("./main/gdprDeleteRequest/create-gdprdeleterequest"),
  UpdateGdprDeleteRequestManager: require("./main/gdprDeleteRequest/update-gdprdeleterequest"),
  DeleteGdprDeleteRequestManager: require("./main/gdprDeleteRequest/delete-gdprdeleterequest"),
  ListGdprDeleteRequestsManager: require("./main/gdprDeleteRequest/list-gdprdeleterequests"),
  // CompliancePolicy Db Object
  GetCompliancePolicyManager: require("./main/compliancePolicy/get-compliancepolicy"),
  CreateCompliancePolicyManager: require("./main/compliancePolicy/create-compliancepolicy"),
  UpdateCompliancePolicyManager: require("./main/compliancePolicy/update-compliancepolicy"),
  DeleteCompliancePolicyManager: require("./main/compliancePolicy/delete-compliancepolicy"),
  ListCompliancePoliciesManager: require("./main/compliancePolicy/list-compliancepolicies"),
  // GlobalUserRestriction Db Object
  GetGlobalUserRestrictionManager: require("./main/globalUserRestriction/get-globaluserrestriction"),
  CreateGlobalUserRestrictionManager: require("./main/globalUserRestriction/create-globaluserrestriction"),
  UpdateGlobalUserRestrictionManager: require("./main/globalUserRestriction/update-globaluserrestriction"),
  DeleteGlobalUserRestrictionManager: require("./main/globalUserRestriction/delete-globaluserrestriction"),
  ListGlobalUserRestrictionsManager: require("./main/globalUserRestriction/list-globaluserrestrictions"),
};
