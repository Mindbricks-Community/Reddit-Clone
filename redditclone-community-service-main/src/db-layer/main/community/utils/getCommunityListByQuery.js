const { HttpServerError, BadRequestError } = require("common");

const { Community } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getCommunityListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const community = await Community.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!community || community.length === 0) return [];

    //      if (!community || community.length === 0) {
    //      throw new NotFoundError(
    //      `Community with the specified criteria not found`
    //  );
    //}

    return community.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityListByQuery",
      err,
    );
  }
};

module.exports = getCommunityListByQuery;
