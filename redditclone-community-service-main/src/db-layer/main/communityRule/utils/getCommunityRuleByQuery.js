const { HttpServerError, BadRequestError } = require("common");

const { CommunityRule } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getCommunityRuleByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const communityRule = await CommunityRule.findOne({
      where: { ...query, isActive: true },
    });

    if (!communityRule) return null;
    return communityRule.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityRuleByQuery",
      err,
    );
  }
};

module.exports = getCommunityRuleByQuery;
