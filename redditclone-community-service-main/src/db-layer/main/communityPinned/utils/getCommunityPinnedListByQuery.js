const { HttpServerError, BadRequestError } = require("common");

const { CommunityPinned } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getCommunityPinnedListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const communityPinned = await CommunityPinned.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!communityPinned || communityPinned.length === 0) return [];

    //      if (!communityPinned || communityPinned.length === 0) {
    //      throw new NotFoundError(
    //      `CommunityPinned with the specified criteria not found`
    //  );
    //}

    return communityPinned.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityPinnedListByQuery",
      err,
    );
  }
};

module.exports = getCommunityPinnedListByQuery;
