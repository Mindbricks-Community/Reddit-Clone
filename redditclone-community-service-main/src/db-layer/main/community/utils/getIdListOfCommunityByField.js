const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { Community } = require("models");
const { Op } = require("sequelize");

const getIdListOfCommunityByField = async (fieldName, fieldValue, isArray) => {
  try {
    let isValidField = false;

    const communityProperties = [
      "id",
      "name",
      "slug",
      "description",
      "creatorId",
      "bannerUrl",
      "avatarUrl",
      "colorScheme",
      "privacyLevel",
      "isNsfw",
      "allowedPostTypes",
    ];

    isValidField = communityProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof Community[fieldName];

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

    let communityIdList = await Community.findAll(options);

    if (!communityIdList || communityIdList.length === 0) {
      throw new NotFoundError(
        `Community with the specified criteria not found`,
      );
    }

    communityIdList = communityIdList.map((item) => item.id);
    return communityIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfCommunityByField;
