const { GetGdprExportRequestManager } = require("managers");
const { z } = require("zod");

const AdminOpsMcpController = require("../../AdminOpsServiceMcpController");

class GetGdprExportRequestMcpController extends AdminOpsMcpController {
  constructor(params) {
    super("getGdprExportRequest", "getgdprexportrequest", params);
    this.dataName = "gdprExportRequest";
    this.crudType = "get";
  }

  createApiManager() {
    return new GetGdprExportRequestManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        gdprExportRequest: z
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
      gdprExportRequestId: z
        .string()
        .uuid()
        .describe(
          "This id paremeter is used to select the required data object that is queried",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "getGdprExportRequest",
    description: "Get a GDPR export request by ID.",
    parameters: GetGdprExportRequestMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const getGdprExportRequestMcpController =
        new GetGdprExportRequestMcpController(mcpParams);
      try {
        const result = await getGdprExportRequestMcpController.processRequest();
        //return GetGdprExportRequestMcpController.getOutputSchema().parse(result);
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
