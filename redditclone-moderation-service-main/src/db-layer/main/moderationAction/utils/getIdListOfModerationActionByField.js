const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { ModerationAction } = require("models");
const { Op } = require("sequelize");

const getIdListOfModerationActionByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const moderationActionProperties = [
      "id",
      "communityId",
      "targetType",
      "targetId",
      "actionType",
      "performedByUserId",
      "performedByRole",
      "reason",
      "notes",
    ];

    isValidField = moderationActionProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof ModerationAction[fieldName];

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

    let moderationActionIdList = await ModerationAction.findAll(options);

    if (!moderationActionIdList || moderationActionIdList.length === 0) {
      throw new NotFoundError(
        `ModerationAction with the specified criteria not found`,
      );
    }

    moderationActionIdList = moderationActionIdList.map((item) => item.id);
    return moderationActionIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingModerationActionIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfModerationActionByField;
