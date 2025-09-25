const { HttpServerError } = require("common");

const { CompliancePolicy } = require("models");
const { Op } = require("sequelize");

const updateCompliancePolicyByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await CompliancePolicy.update(dataClause, options);
    const compliancePolicyIdList = rows.map((item) => item.id);
    return compliancePolicyIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingCompliancePolicyByIdList",
      err,
    );
  }
};

module.exports = updateCompliancePolicyByIdList;
