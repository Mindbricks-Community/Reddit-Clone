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

const getGdprExportRequestAggById = async (gdprExportRequestId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const gdprExportRequest = Array.isArray(gdprExportRequestId)
      ? await GdprExportRequest.findAll({
          where: {
            id: { [Op.in]: gdprExportRequestId },
            isActive: true,
          },
          include: includes,
        })
      : await GdprExportRequest.findOne({
          where: {
            id: gdprExportRequestId,
            isActive: true,
          },
          include: includes,
        });

    if (!gdprExportRequest) {
      return null;
    }

    const gdprExportRequestData =
      Array.isArray(gdprExportRequestId) && gdprExportRequestId.length > 0
        ? gdprExportRequest.map((item) => item.getData())
        : gdprExportRequest.getData();
    await GdprExportRequest.getCqrsJoins(gdprExportRequestData);
    return gdprExportRequestData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingGdprExportRequestAggById",
      err,
    );
  }
};

module.exports = getGdprExportRequestAggById;
