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

const getCommunityPinnedAggById = async (communityPinnedId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const communityPinned = Array.isArray(communityPinnedId)
      ? await CommunityPinned.findAll({
          where: {
            id: { [Op.in]: communityPinnedId },
            isActive: true,
          },
          include: includes,
        })
      : await CommunityPinned.findOne({
          where: {
            id: communityPinnedId,
            isActive: true,
          },
          include: includes,
        });

    if (!communityPinned) {
      return null;
    }

    const communityPinnedData =
      Array.isArray(communityPinnedId) && communityPinnedId.length > 0
        ? communityPinned.map((item) => item.getData())
        : communityPinned.getData();
    await CommunityPinned.getCqrsJoins(communityPinnedData);
    return communityPinnedData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityPinnedAggById",
      err,
    );
  }
};

module.exports = getCommunityPinnedAggById;
