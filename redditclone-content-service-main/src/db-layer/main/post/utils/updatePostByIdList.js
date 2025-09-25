const { HttpServerError } = require("common");

const { Post } = require("models");
const { Op } = require("sequelize");

const updatePostByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await Post.update(dataClause, options);
    const postIdList = rows.map((item) => item.id);
    return postIdList;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenUpdatingPostByIdList", err);
  }
};

module.exports = updatePostByIdList;
