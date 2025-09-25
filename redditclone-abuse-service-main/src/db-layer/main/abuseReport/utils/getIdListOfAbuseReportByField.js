const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { AbuseReport } = require("models");
const { Op } = require("sequelize");

const getIdListOfAbuseReportByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const abuseReportProperties = [
      "id",
      "reportType",
      "reportStatus",
      "reasonText",
      "reporterUserId",
      "reportedUserId",
      "postId",
      "commentId",
      "origin",
      "resolutionResult",
      "resolvedByUserId",
      "extraData",
    ];

    isValidField = abuseReportProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof AbuseReport[fieldName];

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

    let abuseReportIdList = await AbuseReport.findAll(options);

    if (!abuseReportIdList || abuseReportIdList.length === 0) {
      throw new NotFoundError(
        `AbuseReport with the specified criteria not found`,
      );
    }

    abuseReportIdList = abuseReportIdList.map((item) => item.id);
    return abuseReportIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAbuseReportIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfAbuseReportByField;
