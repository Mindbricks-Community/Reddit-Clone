const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { ErrorLog } = require("models");
const { Op } = require("sequelize");

const getIdListOfErrorLogByField = async (fieldName, fieldValue, isArray) => {
  try {
    let isValidField = false;

    const errorLogProperties = [
      "id",
      "timestamp",
      "serviceName",
      "errorType",
      "message",
      "severity",
      "stackTrace",
      "context",
      "userId",
    ];

    isValidField = errorLogProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof ErrorLog[fieldName];

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

    let errorLogIdList = await ErrorLog.findAll(options);

    if (!errorLogIdList || errorLogIdList.length === 0) {
      throw new NotFoundError(`ErrorLog with the specified criteria not found`);
    }

    errorLogIdList = errorLogIdList.map((item) => item.id);
    return errorLogIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingErrorLogIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfErrorLogByField;
