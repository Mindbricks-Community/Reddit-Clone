const { HttpServerError } = require("common");

let { CommunityAutomodSetting } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getCommunityAutomodSettingById = async (communityAutomodSettingId) => {
  try {
    const communityAutomodSetting = Array.isArray(communityAutomodSettingId)
      ? await CommunityAutomodSetting.findAll({
          where: {
            id: { [Op.in]: communityAutomodSettingId },
            isActive: true,
          },
        })
      : await CommunityAutomodSetting.findOne({
          where: {
            id: communityAutomodSettingId,
            isActive: true,
          },
        });

    if (!communityAutomodSetting) {
      return null;
    }
    return Array.isArray(communityAutomodSettingId)
      ? communityAutomodSetting.map((item) => item.getData())
      : communityAutomodSetting.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityAutomodSettingById",
      err,
    );
  }
};

module.exports = getCommunityAutomodSettingById;
