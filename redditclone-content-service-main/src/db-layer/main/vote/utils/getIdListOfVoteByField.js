const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { Vote } = require("models");
const { Op } = require("sequelize");

const getIdListOfVoteByField = async (fieldName, fieldValue, isArray) => {
  try {
    let isValidField = false;

    const voteProperties = ["id", "userId", "postId", "commentId", "voteType"];

    isValidField = voteProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof Vote[fieldName];

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

    let voteIdList = await Vote.findAll(options);

    if (!voteIdList || voteIdList.length === 0) {
      throw new NotFoundError(`Vote with the specified criteria not found`);
    }

    voteIdList = voteIdList.map((item) => item.id);
    return voteIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingVoteIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfVoteByField;
