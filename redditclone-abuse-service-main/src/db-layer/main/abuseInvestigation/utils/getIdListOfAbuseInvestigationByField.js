const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { AbuseInvestigation } = require("models");
const { Op } = require("sequelize");

const getIdListOfAbuseInvestigationByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const abuseInvestigationProperties = [
      "id",
      "investigationStatus",
      "title",
      "openedByUserId",
      "assignedToUserIds",
      "relatedReportIds",
      "relatedFlagIds",
      "details",
    ];

    isValidField = abuseInvestigationProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof AbuseInvestigation[fieldName];

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

    let abuseInvestigationIdList = await AbuseInvestigation.findAll(options);

    if (!abuseInvestigationIdList || abuseInvestigationIdList.length === 0) {
      throw new NotFoundError(
        `AbuseInvestigation with the specified criteria not found`,
      );
    }

    abuseInvestigationIdList = abuseInvestigationIdList.map((item) => item.id);
    return abuseInvestigationIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAbuseInvestigationIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfAbuseInvestigationByField;
