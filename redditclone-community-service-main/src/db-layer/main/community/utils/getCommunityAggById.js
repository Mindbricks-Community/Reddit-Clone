const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const {
  Community,
  CommunityMember,
  CommunityRule,
  CommunityPinned,
  CommunityAutomodSetting,
} = require("models");
const { Op } = require("sequelize");

const getCommunityAggById = async (communityId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const community = Array.isArray(communityId)
      ? await Community.findAll({
          where: {
            id: { [Op.in]: communityId },
            isActive: true,
          },
          include: includes,
        })
      : await Community.findOne({
          where: {
            id: communityId,
            isActive: true,
          },
          include: includes,
        });

    if (!community) {
      return null;
    }

    const communityData =
      Array.isArray(communityId) && communityId.length > 0
        ? community.map((item) => item.getData())
        : community.getData();
    await Community.getCqrsJoins(communityData);
    return communityData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityAggById",
      err,
    );
  }
};

module.exports = getCommunityAggById;
