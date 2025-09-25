const { HttpServerError, BadRequestError } = require("common");

const { ErrorLog } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getErrorLogListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const errorLog = await ErrorLog.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!errorLog || errorLog.length === 0) return [];

    //      if (!errorLog || errorLog.length === 0) {
    //      throw new NotFoundError(
    //      `ErrorLog with the specified criteria not found`
    //  );
    //}

    return errorLog.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingErrorLogListByQuery",
      err,
    );
  }
};

module.exports = getErrorLogListByQuery;
