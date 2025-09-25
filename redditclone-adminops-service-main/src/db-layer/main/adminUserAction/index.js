const utils = require("./utils");

module.exports = {
  dbGetAdminuseraction: require("./dbGetAdminuseraction"),
  dbCreateAdminuseraction: require("./dbCreateAdminuseraction"),
  dbUpdateAdminuseraction: require("./dbUpdateAdminuseraction"),
  dbDeleteAdminuseraction: require("./dbDeleteAdminuseraction"),
  dbListAdminuseractions: require("./dbListAdminuseractions"),
  createAdminUserAction: utils.createAdminUserAction,
  getIdListOfAdminUserActionByField: utils.getIdListOfAdminUserActionByField,
  getAdminUserActionById: utils.getAdminUserActionById,
  getAdminUserActionAggById: utils.getAdminUserActionAggById,
  getAdminUserActionListByQuery: utils.getAdminUserActionListByQuery,
  getAdminUserActionStatsByQuery: utils.getAdminUserActionStatsByQuery,
  getAdminUserActionByQuery: utils.getAdminUserActionByQuery,
  updateAdminUserActionById: utils.updateAdminUserActionById,
  updateAdminUserActionByIdList: utils.updateAdminUserActionByIdList,
  updateAdminUserActionByQuery: utils.updateAdminUserActionByQuery,
  deleteAdminUserActionById: utils.deleteAdminUserActionById,
  deleteAdminUserActionByQuery: utils.deleteAdminUserActionByQuery,
};
