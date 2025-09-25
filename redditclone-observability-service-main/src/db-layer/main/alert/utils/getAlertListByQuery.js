const { HttpServerError, BadRequestError } = require("common");

const { Alert } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getAlertListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const alert = await Alert.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!alert || alert.length === 0) return [];

    //      if (!alert || alert.length === 0) {
    //      throw new NotFoundError(
    //      `Alert with the specified criteria not found`
    //  );
    //}

    return alert.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAlertListByQuery",
      err,
    );
  }
};

module.exports = getAlertListByQuery;
