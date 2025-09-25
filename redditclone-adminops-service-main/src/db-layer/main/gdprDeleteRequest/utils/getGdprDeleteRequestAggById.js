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

const getGdprDeleteRequestAggById = async (gdprDeleteRequestId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const gdprDeleteRequest = Array.isArray(gdprDeleteRequestId)
      ? await GdprDeleteRequest.findAll({
          where: {
            id: { [Op.in]: gdprDeleteRequestId },
            isActive: true,
          },
          include: includes,
        })
      : await GdprDeleteRequest.findOne({
          where: {
            id: gdprDeleteRequestId,
            isActive: true,
          },
          include: includes,
        });

    if (!gdprDeleteRequest) {
      return null;
    }

    const gdprDeleteRequestData =
      Array.isArray(gdprDeleteRequestId) && gdprDeleteRequestId.length > 0
        ? gdprDeleteRequest.map((item) => item.getData())
        : gdprDeleteRequest.getData();
    await GdprDeleteRequest.getCqrsJoins(gdprDeleteRequestData);
    return gdprDeleteRequestData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingGdprDeleteRequestAggById",
      err,
    );
  }
};

module.exports = getGdprDeleteRequestAggById;
