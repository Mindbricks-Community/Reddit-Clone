const { HttpServerError } = require("common");

const { PostMedia } = require("models");
const { Op } = require("sequelize");

const updatePostMediaByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await PostMedia.update(dataClause, options);
    const postMediaIdList = rows.map((item) => item.id);
    return postMediaIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingPostMediaByIdList",
      err,
    );
  }
};

module.exports = updatePostMediaByIdList;
