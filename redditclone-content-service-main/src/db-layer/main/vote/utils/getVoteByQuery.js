const { HttpServerError, BadRequestError } = require("common");

const { Vote } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getVoteByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const vote = await Vote.findOne({
      where: { ...query, isActive: true },
    });

    if (!vote) return null;
    return vote.getData();
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingVoteByQuery", err);
  }
};

module.exports = getVoteByQuery;
