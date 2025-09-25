const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { AbuseHeuristicTrigger } = require("models");
const { Op } = require("sequelize");

const getIdListOfAbuseHeuristicTriggerByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const abuseHeuristicTriggerProperties = [
      "id",
      "triggerType",
      "userId",
      "ipAddress",
      "targetId",
      "details",
    ];

    isValidField = abuseHeuristicTriggerProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof AbuseHeuristicTrigger[fieldName];

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

    let abuseHeuristicTriggerIdList =
      await AbuseHeuristicTrigger.findAll(options);

    if (
      !abuseHeuristicTriggerIdList ||
      abuseHeuristicTriggerIdList.length === 0
    ) {
      throw new NotFoundError(
        `AbuseHeuristicTrigger with the specified criteria not found`,
      );
    }

    abuseHeuristicTriggerIdList = abuseHeuristicTriggerIdList.map(
      (item) => item.id,
    );
    return abuseHeuristicTriggerIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAbuseHeuristicTriggerIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfAbuseHeuristicTriggerByField;
