const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { GlobalUserRestriction } = require("models");
const { Op } = require("sequelize");

const getIdListOfGlobalUserRestrictionByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const globalUserRestrictionProperties = [
      "id",
      "userId",
      "restrictionType",
      "status",
      "startDate",
      "endDate",
      "reason",
      "adminId",
    ];

    isValidField = globalUserRestrictionProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof GlobalUserRestriction[fieldName];

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

    let globalUserRestrictionIdList =
      await GlobalUserRestriction.findAll(options);

    if (
      !globalUserRestrictionIdList ||
      globalUserRestrictionIdList.length === 0
    ) {
      throw new NotFoundError(
        `GlobalUserRestriction with the specified criteria not found`,
      );
    }

    globalUserRestrictionIdList = globalUserRestrictionIdList.map(
      (item) => item.id,
    );
    return globalUserRestrictionIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingGlobalUserRestrictionIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfGlobalUserRestrictionByField;
