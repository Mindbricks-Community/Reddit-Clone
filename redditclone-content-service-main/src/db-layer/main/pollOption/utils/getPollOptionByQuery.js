const { HttpServerError, BadRequestError } = require("common");

const { PollOption } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getPollOptionByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const pollOption = await PollOption.findOne({
      where: { ...query, isActive: true },
    });

    if (!pollOption) return null;
    return pollOption.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPollOptionByQuery",
      err,
    );
  }
};

module.exports = getPollOptionByQuery;
