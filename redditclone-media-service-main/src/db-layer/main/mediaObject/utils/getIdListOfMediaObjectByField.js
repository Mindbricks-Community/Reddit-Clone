const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { MediaObject } = require("models");
const { Op } = require("sequelize");

const getIdListOfMediaObjectByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const mediaObjectProperties = [
      "id",
      "ownerUserId",
      "mediaType",
      "originalUrl",
      "optimizedUrl",
      "previewUrl",
      "filename",
      "fileSize",
      "status",
      "nsfwScore",
      "malwareStatus",
    ];

    isValidField = mediaObjectProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof MediaObject[fieldName];

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

    let mediaObjectIdList = await MediaObject.findAll(options);

    if (!mediaObjectIdList || mediaObjectIdList.length === 0) {
      throw new NotFoundError(
        `MediaObject with the specified criteria not found`,
      );
    }

    mediaObjectIdList = mediaObjectIdList.map((item) => item.id);
    return mediaObjectIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingMediaObjectIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfMediaObjectByField;
