const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { GdprDeleteRequest } = require("models");
const { Op } = require("sequelize");

const getIdListOfGdprDeleteRequestByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const gdprDeleteRequestProperties = [
      "id",
      "userId",
      "requestedByAdminId",
      "status",
      "errorMsg",
    ];

    isValidField = gdprDeleteRequestProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof GdprDeleteRequest[fieldName];

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

    let gdprDeleteRequestIdList = await GdprDeleteRequest.findAll(options);

    if (!gdprDeleteRequestIdList || gdprDeleteRequestIdList.length === 0) {
      throw new NotFoundError(
        `GdprDeleteRequest with the specified criteria not found`,
      );
    }

    gdprDeleteRequestIdList = gdprDeleteRequestIdList.map((item) => item.id);
    return gdprDeleteRequestIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingGdprDeleteRequestIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfGdprDeleteRequestByField;
