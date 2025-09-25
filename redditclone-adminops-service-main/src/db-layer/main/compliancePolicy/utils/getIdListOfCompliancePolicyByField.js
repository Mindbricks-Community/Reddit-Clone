const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { CompliancePolicy } = require("models");
const { Op } = require("sequelize");

const getIdListOfCompliancePolicyByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const compliancePolicyProperties = [
      "id",
      "minAge",
      "gdprExportEnabled",
      "gdprDeleteEnabled",
    ];

    isValidField = compliancePolicyProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof CompliancePolicy[fieldName];

    if (typeof fieldValue !== expectedType) {
      throw new BadRequestError(
        `Invalid field value type for ${fieldName}. Expected ${expectedType}.`,
      );
    }

    const options = {
      where: isArray
        ? { [fieldName]: { [Op.contains]: [fieldValue] }, isActive: true }
        : { [fieldName]: fieldValue, isActive: true },
      attributes: ["id"],
    };

    let compliancePolicyIdList = await CompliancePolicy.findAll(options);

    if (!compliancePolicyIdList || compliancePolicyIdList.length === 0) {
      throw new NotFoundError(
        `CompliancePolicy with the specified criteria not found`,
      );
    }

    compliancePolicyIdList = compliancePolicyIdList.map((item) => item.id);
    return compliancePolicyIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCompliancePolicyIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfCompliancePolicyByField;
