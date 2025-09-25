const { HttpServerError } = require("common");

let { Vote } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getVoteById = async (voteId) => {
  try {
    const vote = Array.isArray(voteId)
      ? await Vote.findAll({
          where: {
            id: { [Op.in]: voteId },
            isActive: true,
          },
        })
      : await Vote.findOne({
          where: {
            id: voteId,
            isActive: true,
          },
        });

    if (!vote) {
      return null;
    }
    return Array.isArray(voteId)
      ? vote.map((item) => item.getData())
      : vote.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError("errMsg_dbErrorWhenRequestingVoteById", err);
  }
};

module.exports = getVoteById;
