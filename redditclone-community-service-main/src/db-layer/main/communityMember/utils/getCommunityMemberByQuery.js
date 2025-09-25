const { HttpServerError, BadRequestError } = require("common");

const { CommunityMember } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getCommunityMemberByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const communityMember = await CommunityMember.findOne({
      where: { ...query, isActive: true },
    });

    if (!communityMember) return null;
    return communityMember.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityMemberByQuery",
      err,
    );
  }
};

module.exports = getCommunityMemberByQuery;
