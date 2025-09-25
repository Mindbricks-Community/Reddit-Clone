const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { CommunityRule } = require("models");
const { Op } = require("sequelize");

const getIdListOfCommunityRuleByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const communityRuleProperties = [
      "id",
      "communityId",
      "shortName",
      "description",
      "orderIndex",
    ];

    isValidField = communityRuleProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof CommunityRule[fieldName];

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

    let communityRuleIdList = await CommunityRule.findAll(options);

    if (!communityRuleIdList || communityRuleIdList.length === 0) {
      throw new NotFoundError(
        `CommunityRule with the specified criteria not found`,
      );
    }

    communityRuleIdList = communityRuleIdList.map((item) => item.id);
    return communityRuleIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityRuleIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfCommunityRuleByField;
