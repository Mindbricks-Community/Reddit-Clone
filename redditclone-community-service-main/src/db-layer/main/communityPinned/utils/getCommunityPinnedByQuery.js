const { HttpServerError, BadRequestError } = require("common");

const { CommunityPinned } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getCommunityPinnedByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const communityPinned = await CommunityPinned.findOne({
      where: { ...query, isActive: true },
    });

    if (!communityPinned) return null;
    return communityPinned.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityPinnedByQuery",
      err,
    );
  }
};

module.exports = getCommunityPinnedByQuery;
