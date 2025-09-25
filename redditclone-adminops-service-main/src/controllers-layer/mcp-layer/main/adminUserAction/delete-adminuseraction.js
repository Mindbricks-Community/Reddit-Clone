const { DeleteAdminUserActionManager } = require("managers");
const { z } = require("zod");

const AdminOpsMcpController = require("../../AdminOpsServiceMcpController");

class DeleteAdminUserActionMcpController extends AdminOpsMcpController {
  constructor(params) {
    super("deleteAdminUserAction", "deleteadminuseraction", params);
    this.dataName = "adminUserAction";
    this.crudType = "delete";
  }

  createApiManager() {
    return new DeleteAdminUserActionManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        adminUserAction: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            adminId: z
              .string()
              .uuid()
              .describe("ID of the admin who performed the action"),
            targetType: z
              .enum(["user", "post", "comment", "other"])
              .describe("Type of entity targeted: user, post, comment, other"),
            targetId: z
              .string()
              .uuid()
              .describe(
                "ID of the entity acted upon (userId, postId, or commentId, according to targetType)",
              ),
            actionType: z
              .enum([
                "ban",
                "unban",
                "suspend",
                "warn",
                "removeContent",
                "unlockContent",
                "exportData",
                "deleteAccount",
                "overrideRestriction",
                "other",
              ])
              .describe(
                "Type of admin action (ban, unban, suspend, warn, removeContent, unlock, export, deleteAccount, overrideRestriction, other)",
              ),
            reason: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe("Short public reason for admin action"),
            notes: z
              .string()
              .optional()
              .nullable()
              .describe(
                "Detailed private notes about the action (visible to admins only)",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Logs platform-level administrative actions taken by admins (e.g., user ban, content removal, compliance actions) for audit and compliance purposes.",
          ),
      })
      .describe("The response object of the crud route");
  }

  static getInputScheme() {
    return {
      accessToken: z
        .string()
        .optional()
        .describe(
          "The access token which is returned from a login request or given by user. This access token will override if there is any bearer or OAuth token in the mcp client. If not given the request will be made with the system (bearer or OAuth) token. For public routes you dont need to deifne any access token.",
        ),
      adminUserActionId: z
        .string()
        .uuid()
        .describe(
          "This id paremeter is used to select the required data object that will be deleted",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "deleteAdminUserAction",
    description: "Delete an admin user action log entry.",
    parameters: DeleteAdminUserActionMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const deleteAdminUserActionMcpController =
        new DeleteAdminUserActionMcpController(mcpParams);
      try {
        const result =
          await deleteAdminUserActionMcpController.processRequest();
        //return DeleteAdminUserActionMcpController.getOutputSchema().parse(result);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result),
            },
          ],
        };
      } catch (err) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }
    },
  };
};
