const { HttpServerError, BadRequestError } = require("common");

const { Alert } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getAlertByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const alert = await Alert.findOne({
      where: { ...query, isActive: true },
    });

    if (!alert) return null;
    return alert.getData();
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingAlertByQuery", err);
  }
};

module.exports = getAlertByQuery;
