const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { Alert } = require("models");
const { Op } = require("sequelize");

const getIdListOfAlertByField = async (fieldName, fieldValue, isArray) => {
  try {
    let isValidField = false;

    const alertProperties = [
      "id",
      "title",
      "affectedServices",
      "status",
      "severity",
      "sloEventIds",
      "errorLogIds",
      "resolvedByUserId",
      "notes",
    ];

    isValidField = alertProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof Alert[fieldName];

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

    let alertIdList = await Alert.findAll(options);

    if (!alertIdList || alertIdList.length === 0) {
      throw new NotFoundError(`Alert with the specified criteria not found`);
    }

    alertIdList = alertIdList.map((item) => item.id);
    return alertIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAlertIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfAlertByField;
