const { HttpServerError, BadRequestError } = require("common");

const { CommunityMember } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getCommunityMemberListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const communityMember = await CommunityMember.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!communityMember || communityMember.length === 0) return [];

    //      if (!communityMember || communityMember.length === 0) {
    //      throw new NotFoundError(
    //      `CommunityMember with the specified criteria not found`
    //  );
    //}

    return communityMember.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityMemberListByQuery",
      err,
    );
  }
};

module.exports = getCommunityMemberListByQuery;
