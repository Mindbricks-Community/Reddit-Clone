const { HttpServerError, BadRequestError } = require("common");

const { Community } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getCommunityByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const community = await Community.findOne({
      where: { ...query, isActive: true },
    });

    if (!community) return null;
    return community.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityByQuery",
      err,
    );
  }
};

module.exports = getCommunityByQuery;
