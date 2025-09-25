const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { GdprExportRequest } = require("models");
const { Op } = require("sequelize");

const getIdListOfGdprExportRequestByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const gdprExportRequestProperties = [
      "id",
      "userId",
      "requestedByAdminId",
      "status",
      "exportUrl",
      "errorMsg",
    ];

    isValidField = gdprExportRequestProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof GdprExportRequest[fieldName];

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

    let gdprExportRequestIdList = await GdprExportRequest.findAll(options);

    if (!gdprExportRequestIdList || gdprExportRequestIdList.length === 0) {
      throw new NotFoundError(
        `GdprExportRequest with the specified criteria not found`,
      );
    }

    gdprExportRequestIdList = gdprExportRequestIdList.map((item) => item.id);
    return gdprExportRequestIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingGdprExportRequestIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfGdprExportRequestByField;
