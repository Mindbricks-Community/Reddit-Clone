const { HttpServerError, BadRequestError } = require("common");

const { CompliancePolicy } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getCompliancePolicyByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const compliancePolicy = await CompliancePolicy.findOne({
      where: { ...query, isActive: true },
    });

    if (!compliancePolicy) return null;
    return compliancePolicy.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCompliancePolicyByQuery",
      err,
    );
  }
};

module.exports = getCompliancePolicyByQuery;
