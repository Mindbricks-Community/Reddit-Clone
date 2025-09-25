const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const {
  AdminUserAction,
  GdprExportRequest,
  GdprDeleteRequest,
  CompliancePolicy,
  GlobalUserRestriction,
} = require("models");
const { Op } = require("sequelize");

const getAdminUserActionAggById = async (adminUserActionId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const adminUserAction = Array.isArray(adminUserActionId)
      ? await AdminUserAction.findAll({
          where: {
            id: { [Op.in]: adminUserActionId },
            isActive: true,
          },
          include: includes,
        })
      : await AdminUserAction.findOne({
          where: {
            id: adminUserActionId,
            isActive: true,
          },
          include: includes,
        });

    if (!adminUserAction) {
      return null;
    }

    const adminUserActionData =
      Array.isArray(adminUserActionId) && adminUserActionId.length > 0
        ? adminUserAction.map((item) => item.getData())
        : adminUserAction.getData();
    await AdminUserAction.getCqrsJoins(adminUserActionData);
    return adminUserActionData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAdminUserActionAggById",
      err,
    );
  }
};

module.exports = getAdminUserActionAggById;
