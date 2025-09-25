const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { Post } = require("models");
const { Op } = require("sequelize");

const getIdListOfPostByField = async (fieldName, fieldValue, isArray) => {
  try {
    let isValidField = false;

    const postProperties = [
      "id",
      "communityId",
      "userId",
      "title",
      "bodyText",
      "externalUrl",
      "postType",
      "status",
      "isNsfw",
      "upVotes",
      "downVotes",
    ];

    isValidField = postProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof Post[fieldName];

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

    let postIdList = await Post.findAll(options);

    if (!postIdList || postIdList.length === 0) {
      throw new NotFoundError(`Post with the specified criteria not found`);
    }

    postIdList = postIdList.map((item) => item.id);
    return postIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPostIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfPostByField;
