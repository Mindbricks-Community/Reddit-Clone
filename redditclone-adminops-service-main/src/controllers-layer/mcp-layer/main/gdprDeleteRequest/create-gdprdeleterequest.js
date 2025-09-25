const { CreateGdprDeleteRequestManager } = require("managers");
const { z } = require("zod");

const AdminOpsMcpController = require("../../AdminOpsServiceMcpController");

class CreateGdprDeleteRequestMcpController extends AdminOpsMcpController {
  constructor(params) {
    super("createGdprDeleteRequest", "creategdprdeleterequest", params);
    this.dataName = "gdprDeleteRequest";
    this.crudType = "create";
  }

  createApiManager() {
    return new CreateGdprDeleteRequestManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        gdprDeleteRequest: z
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
      userId: z
        .string()
        .uuid()
        .describe("ID of the user whose data/account deletion is requested"),

      requestedByAdminId: z
        .string()
        .uuid()
        .optional()
        .describe(
          "ID of admin who initiated the deletion (null if user-initiated)",
        ),

      status: z
        .enum([])
        .describe(
          "Status of delete request: pending, processing, completed, failed, canceled",
        ),

      errorMsg: z
        .string()
        .max(255)
        .optional()
        .describe("Failure details (if status=failed or canceled)"),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "createGdprDeleteRequest",
    description: "Create a new GDPR delete request entry.",
    parameters: CreateGdprDeleteRequestMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const createGdprDeleteRequestMcpController =
        new CreateGdprDeleteRequestMcpController(mcpParams);
      try {
        const result =
          await createGdprDeleteRequestMcpController.processRequest();
        //return CreateGdprDeleteRequestMcpController.getOutputSchema().parse(result);
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
