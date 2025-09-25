const { HttpServerError, BadRequestError } = require("common");

const { ErrorLog } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getErrorLogByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const errorLog = await ErrorLog.findOne({
      where: { ...query, isActive: true },
    });

    if (!errorLog) return null;
    return errorLog.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingErrorLogByQuery",
      err,
    );
  }
};

module.exports = getErrorLogByQuery;
