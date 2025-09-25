const { HttpServerError, BadRequestError } = require("common");
const { CommunityMember } = require("models");
const { Op } = require("sequelize");
// shoul i add softdelete condition?
const deleteCommunityMemberByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    let rowsCount = null;
    let rows = null;
    const options = { where: { ...query, isActive: true }, returning: true };
    [rowsCount, rows] = await CommunityMember.update(
      { isActive: false },
      options,
    );
    if (!rowsCount) return [];
    return rows.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenDeletingCommunityMemberByQuery",
      err,
    );
  }
};

module.exports = deleteCommunityMemberByQuery;
