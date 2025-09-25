const { ListGdprExportRequestsManager } = require("managers");
const { z } = require("zod");

const AdminOpsMcpController = require("../../AdminOpsServiceMcpController");

class ListGdprExportRequestsMcpController extends AdminOpsMcpController {
  constructor(params) {
    super("listGdprExportRequests", "listgdprexportrequests", params);
    this.dataName = "gdprExportRequests";
    this.crudType = "getList";
  }

  createApiManager() {
    return new ListGdprExportRequestsManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        gdprExportRequests: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            userId: z
              .string()
              .uuid()
              .describe("ID of the user whose data export is requested"),
            requestedByAdminId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe(
                "ID of admin who initiated the export (null if user-initiated)",
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
                "Status of export request: pending, processing, completed, failed, canceled",
              ),
            exportUrl: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "URL where user can download the exported data (if completed)",
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
            "Tracks and manages user data export requests for GDPR compliance (user or admin-initiated).",
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
    name: "listGdprExportRequests",
    description: "List GDPR export requests, with filters.",
    parameters: ListGdprExportRequestsMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const listGdprExportRequestsMcpController =
        new ListGdprExportRequestsMcpController(mcpParams);
      try {
        const result =
          await listGdprExportRequestsMcpController.processRequest();
        //return ListGdprExportRequestsMcpController.getOutputSchema().parse(result);
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
