const { HttpServerError } = require("common");

const { AdminUserAction } = require("models");
const { Op } = require("sequelize");

const updateAdminUserActionByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await AdminUserAction.update(dataClause, options);
    const adminUserActionIdList = rows.map((item) => item.id);
    return adminUserActionIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingAdminUserActionByIdList",
      err,
    );
  }
};

module.exports = updateAdminUserActionByIdList;
