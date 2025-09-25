const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { PostMedia } = require("models");
const { Op } = require("sequelize");

const getIdListOfPostMediaByField = async (fieldName, fieldValue, isArray) => {
  try {
    let isValidField = false;

    const postMediaProperties = [
      "id",
      "mediaObjectId",
      "postId",
      "commentId",
      "mediaIndex",
      "caption",
    ];

    isValidField = postMediaProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof PostMedia[fieldName];

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

    let postMediaIdList = await PostMedia.findAll(options);

    if (!postMediaIdList || postMediaIdList.length === 0) {
      throw new NotFoundError(
        `PostMedia with the specified criteria not found`,
      );
    }

    postMediaIdList = postMediaIdList.map((item) => item.id);
    return postMediaIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPostMediaIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfPostMediaByField;
