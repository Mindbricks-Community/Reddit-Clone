const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { AbuseFlag } = require("models");
const { Op } = require("sequelize");

const getIdListOfAbuseFlagByField = async (fieldName, fieldValue, isArray) => {
  try {
    let isValidField = false;

    const abuseFlagProperties = [
      "id",
      "flagType",
      "flagStatus",
      "postId",
      "commentId",
      "userId",
      "mediaObjectId",
      "origin",
      "details",
    ];

    isValidField = abuseFlagProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof AbuseFlag[fieldName];

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

    let abuseFlagIdList = await AbuseFlag.findAll(options);

    if (!abuseFlagIdList || abuseFlagIdList.length === 0) {
      throw new NotFoundError(
        `AbuseFlag with the specified criteria not found`,
      );
    }

    abuseFlagIdList = abuseFlagIdList.map((item) => item.id);
    return abuseFlagIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAbuseFlagIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfAbuseFlagByField;
