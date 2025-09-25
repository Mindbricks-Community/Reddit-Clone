const { HttpServerError, BadRequestError } = require("common");

const { AdminUserAction } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getAdminUserActionByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const adminUserAction = await AdminUserAction.findOne({
      where: { ...query, isActive: true },
    });

    if (!adminUserAction) return null;
    return adminUserAction.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAdminUserActionByQuery",
      err,
    );
  }
};

module.exports = getAdminUserActionByQuery;
