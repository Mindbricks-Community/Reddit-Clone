const { ListModerationAuditLogsManager } = require("managers");
const { z } = require("zod");

const ModerationMcpController = require("../../ModerationServiceMcpController");

class ListModerationAuditLogsMcpController extends ModerationMcpController {
  constructor(params) {
    super("listModerationAuditLogs", "listmoderationauditlogs", params);
    this.dataName = "moderationAuditLogs";
    this.crudType = "getList";
  }

  createApiManager() {
    return new ListModerationAuditLogsManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        moderationAuditLogs: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            logEntryType: z
              .enum([
                "moderationAction",
                "automodEvent",
                "reportLinked",
                "bulkAction",
              ])
              .describe(
                "Type of log entry: 0=moderationAction, 1=automodEvent, 2=reportLinked, 3=bulkAction.",
              ),
            communityId: z
              .string()
              .uuid()
              .describe("Community context of the log entry."),
            entityType: z
              .enum(["post", "comment", "user", "other"])
              .optional()
              .nullable()
              .describe(
                "Entity type the log references: 0=post, 1=comment, 2=user, 3=other.",
              ),
            entityId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe("ID of the referenced post/comment/user/object."),
            actionUserId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe("ID of the actor (moderator/admin/user/automod)."),
            linkedModerationActionId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe(
                "If this log is tied to a specific moderationAction entry.",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Complete audit log of all moderation and automod events, including manual actions, automated actions, and source context.",
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
    name: "listModerationAuditLogs",
    description:
      "List moderation audit logs (platform, community, actor, etc.).",
    parameters: ListModerationAuditLogsMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const listModerationAuditLogsMcpController =
        new ListModerationAuditLogsMcpController(mcpParams);
      try {
        const result =
          await listModerationAuditLogsMcpController.processRequest();
        //return ListModerationAuditLogsMcpController.getOutputSchema().parse(result);
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
