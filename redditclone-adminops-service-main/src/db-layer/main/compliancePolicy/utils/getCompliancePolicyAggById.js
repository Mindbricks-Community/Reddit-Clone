const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const {
  AdminUserAction,
  GdprExportRequest,
  GdprDeleteRequest,
  CompliancePolicy,
  GlobalUserRestriction,
} = require("models");
const { Op } = require("sequelize");

const getCompliancePolicyAggById = async (compliancePolicyId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const compliancePolicy = Array.isArray(compliancePolicyId)
      ? await CompliancePolicy.findAll({
          where: {
            id: { [Op.in]: compliancePolicyId },
            isActive: true,
          },
          include: includes,
        })
      : await CompliancePolicy.findOne({
          where: {
            id: compliancePolicyId,
            isActive: true,
          },
          include: includes,
        });

    if (!compliancePolicy) {
      return null;
    }

    const compliancePolicyData =
      Array.isArray(compliancePolicyId) && compliancePolicyId.length > 0
        ? compliancePolicy.map((item) => item.getData())
        : compliancePolicy.getData();
    await CompliancePolicy.getCqrsJoins(compliancePolicyData);
    return compliancePolicyData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCompliancePolicyAggById",
      err,
    );
  }
};

module.exports = getCompliancePolicyAggById;
