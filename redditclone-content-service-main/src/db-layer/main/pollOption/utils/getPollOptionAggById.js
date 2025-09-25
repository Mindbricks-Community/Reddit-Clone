const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const { Post, Comment, Vote, PollOption, PostMedia } = require("models");
const { Op } = require("sequelize");

const getPollOptionAggById = async (pollOptionId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const pollOption = Array.isArray(pollOptionId)
      ? await PollOption.findAll({
          where: {
            id: { [Op.in]: pollOptionId },
            isActive: true,
          },
          include: includes,
        })
      : await PollOption.findOne({
          where: {
            id: pollOptionId,
            isActive: true,
          },
          include: includes,
        });

    if (!pollOption) {
      return null;
    }

    const pollOptionData =
      Array.isArray(pollOptionId) && pollOptionId.length > 0
        ? pollOption.map((item) => item.getData())
        : pollOption.getData();
    await PollOption.getCqrsJoins(pollOptionData);
    return pollOptionData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPollOptionAggById",
      err,
    );
  }
};

module.exports = getPollOptionAggById;
