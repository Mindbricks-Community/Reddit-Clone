const { HttpServerError, BadRequestError } = require("common");

const { Vote } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getVoteListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const vote = await Vote.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!vote || vote.length === 0) return [];

    //      if (!vote || vote.length === 0) {
    //      throw new NotFoundError(
    //      `Vote with the specified criteria not found`
    //  );
    //}

    return vote.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingVoteListByQuery",
      err,
    );
  }
};

module.exports = getVoteListByQuery;
