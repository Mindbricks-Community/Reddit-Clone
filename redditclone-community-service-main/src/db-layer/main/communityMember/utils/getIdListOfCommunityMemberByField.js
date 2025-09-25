const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { CommunityMember } = require("models");
const { Op } = require("sequelize");

const getIdListOfCommunityMemberByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const communityMemberProperties = [
      "id",
      "communityId",
      "userId",
      "role",
      "status",
    ];

    isValidField = communityMemberProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof CommunityMember[fieldName];

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

    let communityMemberIdList = await CommunityMember.findAll(options);

    if (!communityMemberIdList || communityMemberIdList.length === 0) {
      throw new NotFoundError(
        `CommunityMember with the specified criteria not found`,
      );
    }

    communityMemberIdList = communityMemberIdList.map((item) => item.id);
    return communityMemberIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityMemberIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfCommunityMemberByField;
