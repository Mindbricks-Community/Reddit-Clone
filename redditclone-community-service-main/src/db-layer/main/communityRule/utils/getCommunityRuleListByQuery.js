const { HttpServerError, BadRequestError } = require("common");

const { CommunityRule } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getCommunityRuleListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const communityRule = await CommunityRule.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!communityRule || communityRule.length === 0) return [];

    //      if (!communityRule || communityRule.length === 0) {
    //      throw new NotFoundError(
    //      `CommunityRule with the specified criteria not found`
    //  );
    //}

    return communityRule.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityRuleListByQuery",
      err,
    );
  }
};

module.exports = getCommunityRuleListByQuery;
