const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { AutomodEvent } = require("models");
const { Op } = require("sequelize");

const getIdListOfAutomodEventByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const automodEventProperties = [
      "id",
      "communityId",
      "targetType",
      "targetId",
      "automodType",
      "ruleId",
      "performedByAutomod",
      "triggerDetails",
    ];

    isValidField = automodEventProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof AutomodEvent[fieldName];

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

    let automodEventIdList = await AutomodEvent.findAll(options);

    if (!automodEventIdList || automodEventIdList.length === 0) {
      throw new NotFoundError(
        `AutomodEvent with the specified criteria not found`,
      );
    }

    automodEventIdList = automodEventIdList.map((item) => item.id);
    return automodEventIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAutomodEventIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfAutomodEventByField;
