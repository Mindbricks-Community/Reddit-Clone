const { HttpServerError } = require("common");

let { CompliancePolicy } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getCompliancePolicyById = async (compliancePolicyId) => {
  try {
    const compliancePolicy = Array.isArray(compliancePolicyId)
      ? await CompliancePolicy.findAll({
          where: {
            id: { [Op.in]: compliancePolicyId },
            isActive: true,
          },
        })
      : await CompliancePolicy.findOne({
          where: {
            id: compliancePolicyId,
            isActive: true,
          },
        });

    if (!compliancePolicy) {
      return null;
    }
    return Array.isArray(compliancePolicyId)
      ? compliancePolicy.map((item) => item.getData())
      : compliancePolicy.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCompliancePolicyById",
      err,
    );
  }
};

module.exports = getCompliancePolicyById;
