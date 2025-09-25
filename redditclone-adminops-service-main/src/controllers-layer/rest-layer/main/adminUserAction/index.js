const express = require("express");

// AdminUserAction Db Object Rest Api Router
const adminUserActionRouter = express.Router();

// add AdminUserAction controllers

// getAdminUserAction controller
adminUserActionRouter.get(
  "/adminuseractions/:adminUserActionId",
  require("./get-adminuseraction"),
);
// createAdminUserAction controller
adminUserActionRouter.post(
  "/adminuseractions",
  require("./create-adminuseraction"),
);
// updateAdminUserAction controller
adminUserActionRouter.patch(
  "/adminuseractions/:adminUserActionId",
  require("./update-adminuseraction"),
);
// deleteAdminUserAction controller
adminUserActionRouter.delete(
  "/adminuseractions/:adminUserActionId",
  require("./delete-adminuseraction"),
);
// listAdminUserActions controller
adminUserActionRouter.get(
  "/adminuseractions",
  require("./list-adminuseractions"),
);

module.exports = adminUserActionRouter;
