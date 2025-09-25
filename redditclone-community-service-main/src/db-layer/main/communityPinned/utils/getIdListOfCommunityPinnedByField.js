const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { CommunityPinned } = require("models");
const { Op } = require("sequelize");

const getIdListOfCommunityPinnedByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const communityPinnedProperties = [
      "id",
      "communityId",
      "targetType",
      "targetId",
      "orderIndex",
    ];

    isValidField = communityPinnedProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof CommunityPinned[fieldName];

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

    let communityPinnedIdList = await CommunityPinned.findAll(options);

    if (!communityPinnedIdList || communityPinnedIdList.length === 0) {
      throw new NotFoundError(
        `CommunityPinned with the specified criteria not found`,
      );
    }

    communityPinnedIdList = communityPinnedIdList.map((item) => item.id);
    return communityPinnedIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityPinnedIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfCommunityPinnedByField;
