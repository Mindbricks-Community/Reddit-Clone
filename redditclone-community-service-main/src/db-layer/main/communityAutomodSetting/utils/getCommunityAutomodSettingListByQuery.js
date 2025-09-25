const { HttpServerError, BadRequestError } = require("common");

const { CommunityAutomodSetting } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getCommunityAutomodSettingListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const communityAutomodSetting = await CommunityAutomodSetting.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!communityAutomodSetting || communityAutomodSetting.length === 0)
      return [];

    //      if (!communityAutomodSetting || communityAutomodSetting.length === 0) {
    //      throw new NotFoundError(
    //      `CommunityAutomodSetting with the specified criteria not found`
    //  );
    //}

    return communityAutomodSetting.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCommunityAutomodSettingListByQuery",
      err,
    );
  }
};

module.exports = getCommunityAutomodSettingListByQuery;
