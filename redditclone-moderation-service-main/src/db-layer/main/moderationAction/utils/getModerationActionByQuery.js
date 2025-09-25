const { HttpServerError, BadRequestError } = require("common");

const { ModerationAction } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getModerationActionByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const moderationAction = await ModerationAction.findOne({
      where: { ...query, isActive: true },
    });

    if (!moderationAction) return null;
    return moderationAction.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingModerationActionByQuery",
      err,
    );
  }
};

module.exports = getModerationActionByQuery;
