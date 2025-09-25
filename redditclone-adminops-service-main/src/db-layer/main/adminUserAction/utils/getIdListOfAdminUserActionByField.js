const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { AdminUserAction } = require("models");
const { Op } = require("sequelize");

const getIdListOfAdminUserActionByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const adminUserActionProperties = [
      "id",
      "adminId",
      "targetType",
      "targetId",
      "actionType",
      "reason",
      "notes",
    ];

    isValidField = adminUserActionProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof AdminUserAction[fieldName];

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

    let adminUserActionIdList = await AdminUserAction.findAll(options);

    if (!adminUserActionIdList || adminUserActionIdList.length === 0) {
      throw new NotFoundError(
        `AdminUserAction with the specified criteria not found`,
      );
    }

    adminUserActionIdList = adminUserActionIdList.map((item) => item.id);
    return adminUserActionIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAdminUserActionIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfAdminUserActionByField;
