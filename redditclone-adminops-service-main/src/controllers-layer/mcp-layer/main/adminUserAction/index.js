module.exports = (headers) => {
  // AdminUserAction Db Object Rest Api Router
  const adminUserActionMcpRouter = [];
  // getAdminUserAction controller
  adminUserActionMcpRouter.push(require("./get-adminuseraction")(headers));
  // createAdminUserAction controller
  adminUserActionMcpRouter.push(require("./create-adminuseraction")(headers));
  // updateAdminUserAction controller
  adminUserActionMcpRouter.push(require("./update-adminuseraction")(headers));
  // deleteAdminUserAction controller
  adminUserActionMcpRouter.push(require("./delete-adminuseraction")(headers));
  // listAdminUserActions controller
  adminUserActionMcpRouter.push(require("./list-adminuseractions")(headers));
  return adminUserActionMcpRouter;
};
