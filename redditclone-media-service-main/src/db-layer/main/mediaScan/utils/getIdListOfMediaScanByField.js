const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { MediaScan } = require("models");
const { Op } = require("sequelize");

const getIdListOfMediaScanByField = async (fieldName, fieldValue, isArray) => {
  try {
    let isValidField = false;

    const mediaScanProperties = [
      "id",
      "mediaObjectId",
      "scanType",
      "result",
      "scanStatus",
    ];

    isValidField = mediaScanProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof MediaScan[fieldName];

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

    let mediaScanIdList = await MediaScan.findAll(options);

    if (!mediaScanIdList || mediaScanIdList.length === 0) {
      throw new NotFoundError(
        `MediaScan with the specified criteria not found`,
      );
    }

    mediaScanIdList = mediaScanIdList.map((item) => item.id);
    return mediaScanIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingMediaScanIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfMediaScanByField;
