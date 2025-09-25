const { HttpServerError, BadRequestError } = require("common");

const { AdminUserAction } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getAdminUserActionListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const adminUserAction = await AdminUserAction.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!adminUserAction || adminUserAction.length === 0) return [];

    //      if (!adminUserAction || adminUserAction.length === 0) {
    //      throw new NotFoundError(
    //      `AdminUserAction with the specified criteria not found`
    //  );
    //}

    return adminUserAction.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAdminUserActionListByQuery",
      err,
    );
  }
};

module.exports = getAdminUserActionListByQuery;
