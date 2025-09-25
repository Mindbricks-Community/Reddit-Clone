const { ListGdprDeleteRequestsManager } = require("managers");
const { z } = require("zod");

const AdminOpsMcpController = require("../../AdminOpsServiceMcpController");

class ListGdprDeleteRequestsMcpController extends AdminOpsMcpController {
  constructor(params) {
    super("listGdprDeleteRequests", "listgdprdeleterequests", params);
    this.dataName = "gdprDeleteRequests";
    this.crudType = "getList";
  }

  createApiManager() {
    return new ListGdprDeleteRequestsManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        gdprDeleteRequests: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            userId: z
              .string()
              .uuid()
              .describe(
                "ID of the user whose data/account deletion is requested",
              ),
            requestedByAdminId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe(
                "ID of admin who initiated the deletion (null if user-initiated)",
              ),
            status: z
              .enum([
                "pending",
                "processing",
                "completed",
                "failed",
                "canceled",
              ])
              .describe(
                "Status of delete request: pending, processing, completed, failed, canceled",
              ),
            errorMsg: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe("Failure details (if status=failed or canceled)"),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Tracks and manages user data/account erasure requests for GDPR compliance (user or admin-initiated).",
          )
          .array(),
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
    };
  }
}

module.exports = (headers) => {
  return {
    name: "listGdprDeleteRequests",
    description: "List GDPR deletion requests, with filters.",
    parameters: ListGdprDeleteRequestsMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const listGdprDeleteRequestsMcpController =
        new ListGdprDeleteRequestsMcpController(mcpParams);
      try {
        const result =
          await listGdprDeleteRequestsMcpController.processRequest();
        //return ListGdprDeleteRequestsMcpController.getOutputSchema().parse(result);
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
