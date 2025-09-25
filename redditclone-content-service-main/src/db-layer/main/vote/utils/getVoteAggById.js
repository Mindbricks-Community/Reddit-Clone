const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const { Post, Comment, Vote, PollOption, PostMedia } = require("models");
const { Op } = require("sequelize");

const getVoteAggById = async (voteId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const vote = Array.isArray(voteId)
      ? await Vote.findAll({
          where: {
            id: { [Op.in]: voteId },
            isActive: true,
          },
          include: includes,
        })
      : await Vote.findOne({
          where: {
            id: voteId,
            isActive: true,
          },
          include: includes,
        });

    if (!vote) {
      return null;
    }

    const voteData =
      Array.isArray(voteId) && voteId.length > 0
        ? vote.map((item) => item.getData())
        : vote.getData();
    await Vote.getCqrsJoins(voteData);
    return voteData;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingVoteAggById", err);
  }
};

module.exports = getVoteAggById;
