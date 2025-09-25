const { HttpServerError, BadRequestError } = require("common");

const { CompliancePolicy } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getCompliancePolicyListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const compliancePolicy = await CompliancePolicy.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!compliancePolicy || compliancePolicy.length === 0) return [];

    //      if (!compliancePolicy || compliancePolicy.length === 0) {
    //      throw new NotFoundError(
    //      `CompliancePolicy with the specified criteria not found`
    //  );
    //}

    return compliancePolicy.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCompliancePolicyListByQuery",
      err,
    );
  }
};

module.exports = getCompliancePolicyListByQuery;
