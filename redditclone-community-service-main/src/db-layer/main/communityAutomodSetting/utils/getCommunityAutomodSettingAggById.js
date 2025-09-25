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

const getCommunityAutomodSettingAggById = async (communityAutomodSettingId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const communityAutomodSetting = Array.isArray(communityAutomodSettingId)
      ? await CommunityAutomodSetting.findAll({
          where: {
            id: { [Op.in]: communityAutomodSettingId },
            isActive: true,
          },
          include: includes,
        })
      : await CommunityAutomodSetting.findOne({
          where: {
            id: communityAutomodSettingId,
            isActive: true,
          },
          include: includes,
        });

    if (!communityAutomodSetting) {
      return null;
    }

    const communityAutomodSettingData =
      Array.isArray(communityAutomodSettingId) &&
      communityAutomodSettingId.length > 0
        ? communityAutomodSetting.map((item) => item.getData())
        : communityAutomodSetting.getData();
    await CommunityAutomodSetting.getCqrsJoins(communityAutomodSettingData);
    return communityAutomodSettingData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityAutomodSettingAggById",
      err,
    );
  }
};

module.exports = getCommunityAutomodSettingAggById;
