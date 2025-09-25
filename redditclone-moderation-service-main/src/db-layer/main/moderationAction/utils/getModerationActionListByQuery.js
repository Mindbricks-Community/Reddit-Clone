const { HttpServerError, BadRequestError } = require("common");

const { ModerationAction } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getModerationActionListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const moderationAction = await ModerationAction.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!moderationAction || moderationAction.length === 0) return [];

    //      if (!moderationAction || moderationAction.length === 0) {
    //      throw new NotFoundError(
    //      `ModerationAction with the specified criteria not found`
    //  );
    //}

    return moderationAction.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingModerationActionListByQuery",
      err,
    );
  }
};

module.exports = getModerationActionListByQuery;
