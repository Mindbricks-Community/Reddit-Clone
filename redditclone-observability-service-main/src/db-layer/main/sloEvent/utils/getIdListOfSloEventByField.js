const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { SloEvent } = require("models");
const { Op } = require("sequelize");

const getIdListOfSloEventByField = async (fieldName, fieldValue, isArray) => {
  try {
    let isValidField = false;

    const sloEventProperties = [
      "id",
      "eventTime",
      "serviceName",
      "eventType",
      "status",
      "notes",
    ];

    isValidField = sloEventProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof SloEvent[fieldName];

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

    let sloEventIdList = await SloEvent.findAll(options);

    if (!sloEventIdList || sloEventIdList.length === 0) {
      throw new NotFoundError(`SloEvent with the specified criteria not found`);
    }

    sloEventIdList = sloEventIdList.map((item) => item.id);
    return sloEventIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingSloEventIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfSloEventByField;
