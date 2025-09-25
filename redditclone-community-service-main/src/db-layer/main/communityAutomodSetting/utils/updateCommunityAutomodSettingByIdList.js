const { HttpServerError } = require("common");

const { CommunityAutomodSetting } = require("models");
const { Op } = require("sequelize");

const updateCommunityAutomodSettingByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await CommunityAutomodSetting.update(
      dataClause,
      options,
    );
    const communityAutomodSettingIdList = rows.map((item) => item.id);
    return communityAutomodSettingIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingCommunityAutomodSettingByIdList",
      err,
    );
  }
};

module.exports = updateCommunityAutomodSettingByIdList;
