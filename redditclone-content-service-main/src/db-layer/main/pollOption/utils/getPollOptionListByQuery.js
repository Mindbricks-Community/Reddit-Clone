const { HttpServerError, BadRequestError } = require("common");

const { PollOption } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getPollOptionListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const pollOption = await PollOption.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!pollOption || pollOption.length === 0) return [];

    //      if (!pollOption || pollOption.length === 0) {
    //      throw new NotFoundError(
    //      `PollOption with the specified criteria not found`
    //  );
    //}

    return pollOption.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPollOptionListByQuery",
      err,
    );
  }
};

module.exports = getPollOptionListByQuery;
