const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { PollOption } = require("models");
const { Op } = require("sequelize");

const getIdListOfPollOptionByField = async (fieldName, fieldValue, isArray) => {
  try {
    let isValidField = false;

    const pollOptionProperties = [
      "id",
      "postId",
      "optionIndex",
      "optionText",
      "voteCount",
    ];

    isValidField = pollOptionProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof PollOption[fieldName];

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

    let pollOptionIdList = await PollOption.findAll(options);

    if (!pollOptionIdList || pollOptionIdList.length === 0) {
      throw new NotFoundError(
        `PollOption with the specified criteria not found`,
      );
    }

    pollOptionIdList = pollOptionIdList.map((item) => item.id);
    return pollOptionIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPollOptionIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfPollOptionByField;
