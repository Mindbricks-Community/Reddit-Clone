const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { CommunityAutomodSetting } = require("models");
const { Op } = require("sequelize");

const getIdListOfCommunityAutomodSettingByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const communityAutomodSettingProperties = [
      "id",
      "communityId",
      "rulesData",
    ];

    isValidField = communityAutomodSettingProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof CommunityAutomodSetting[fieldName];

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

    let communityAutomodSettingIdList =
      await CommunityAutomodSetting.findAll(options);

    if (
      !communityAutomodSettingIdList ||
      communityAutomodSettingIdList.length === 0
    ) {
      throw new NotFoundError(
        `CommunityAutomodSetting with the specified criteria not found`,
      );
    }

    communityAutomodSettingIdList = communityAutomodSettingIdList.map(
      (item) => item.id,
    );
    return communityAutomodSettingIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityAutomodSettingIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfCommunityAutomodSettingByField;
