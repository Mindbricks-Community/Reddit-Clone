const { HttpServerError } = require("common");

let { AdminUserAction } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getAdminUserActionById = async (adminUserActionId) => {
  try {
    const adminUserAction = Array.isArray(adminUserActionId)
      ? await AdminUserAction.findAll({
          where: {
            id: { [Op.in]: adminUserActionId },
            isActive: true,
          },
        })
      : await AdminUserAction.findOne({
          where: {
            id: adminUserActionId,
            isActive: true,
          },
        });

    if (!adminUserAction) {
      return null;
    }
    return Array.isArray(adminUserActionId)
      ? adminUserAction.map((item) => item.getData())
      : adminUserAction.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAdminUserActionById",
      err,
    );
  }
};

module.exports = getAdminUserActionById;
