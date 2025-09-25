const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { ModmailMessage } = require("models");
const { Op } = require("sequelize");

const getIdListOfModmailMessageByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const modmailMessageProperties = [
      "id",
      "threadId",
      "senderUserId",
      "messageBody",
      "messageType",
    ];

    isValidField = modmailMessageProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof ModmailMessage[fieldName];

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

    let modmailMessageIdList = await ModmailMessage.findAll(options);

    if (!modmailMessageIdList || modmailMessageIdList.length === 0) {
      throw new NotFoundError(
        `ModmailMessage with the specified criteria not found`,
      );
    }

    modmailMessageIdList = modmailMessageIdList.map((item) => item.id);
    return modmailMessageIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingModmailMessageIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfModmailMessageByField;
