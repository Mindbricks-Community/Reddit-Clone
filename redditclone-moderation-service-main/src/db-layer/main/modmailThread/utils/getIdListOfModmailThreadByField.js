const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { ModmailThread } = require("models");
const { Op } = require("sequelize");

const getIdListOfModmailThreadByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const modmailThreadProperties = [
      "id",
      "communityId",
      "subject",
      "createdByUserId",
      "status",
    ];

    isValidField = modmailThreadProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof ModmailThread[fieldName];

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

    let modmailThreadIdList = await ModmailThread.findAll(options);

    if (!modmailThreadIdList || modmailThreadIdList.length === 0) {
      throw new NotFoundError(
        `ModmailThread with the specified criteria not found`,
      );
    }

    modmailThreadIdList = modmailThreadIdList.map((item) => item.id);
    return modmailThreadIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingModmailThreadIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfModmailThreadByField;
