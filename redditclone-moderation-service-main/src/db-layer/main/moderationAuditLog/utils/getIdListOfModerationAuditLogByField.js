const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { ModerationAuditLog } = require("models");
const { Op } = require("sequelize");

const getIdListOfModerationAuditLogByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const moderationAuditLogProperties = [
      "id",
      "logEntryType",
      "communityId",
      "entityType",
      "entityId",
      "actionUserId",
      "linkedModerationActionId",
    ];

    isValidField = moderationAuditLogProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof ModerationAuditLog[fieldName];

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

    let moderationAuditLogIdList = await ModerationAuditLog.findAll(options);

    if (!moderationAuditLogIdList || moderationAuditLogIdList.length === 0) {
      throw new NotFoundError(
        `ModerationAuditLog with the specified criteria not found`,
      );
    }

    moderationAuditLogIdList = moderationAuditLogIdList.map((item) => item.id);
    return moderationAuditLogIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingModerationAuditLogIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfModerationAuditLogByField;
