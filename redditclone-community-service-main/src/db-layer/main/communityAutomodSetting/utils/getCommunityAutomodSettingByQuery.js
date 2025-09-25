const { HttpServerError, BadRequestError } = require("common");

const { CommunityAutomodSetting } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getCommunityAutomodSettingByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const communityAutomodSetting = await CommunityAutomodSetting.findOne({
      where: { ...query, isActive: true },
    });

    if (!communityAutomodSetting) return null;
    return communityAutomodSetting.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityAutomodSettingByQuery",
      err,
    );
  }
};

module.exports = getCommunityAutomodSettingByQuery;
