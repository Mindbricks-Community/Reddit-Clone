const { ListModerationActionsManager } = require("managers");
const { z } = require("zod");

const ModerationMcpController = require("../../ModerationServiceMcpController");

class ListModerationActionsMcpController extends ModerationMcpController {
  constructor(params) {
    super("listModerationActions", "listmoderationactions", params);
    this.dataName = "moderationActions";
    this.crudType = "getList";
  }

  createApiManager() {
    return new ListModerationActionsManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        moderationActions: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            communityId: z
              .string()
              .uuid()
              .describe(
                "Target community where the moderation action takes place.",
              ),
            targetType: z
              .enum(["post", "comment", "user"])
              .describe("Target type: 0=post, 1=comment, 2=user."),
            targetId: z
              .string()
              .uuid()
              .describe(
                "ID of the entity (post, comment, or user) on which action is performed.",
              ),
            actionType: z
              .enum([
                "approve",
                "remove",
                "lock",
                "unlock",
                "warn",
                "tempBan",
                "permBan",
                "unban",
                "bulkRemove",
                "bulkApprove",
                "note",
              ])
              .describe(
                "Action taken: 0=approve, 1=remove, 2=lock, 3=unlock, 4=warn, 5=temp-ban, 6=perm-ban, 7=unban, 8=bulk-remove, 9=bulk-approve, 10=note.",
              ),
            performedByUserId: z
              .string()
              .uuid()
              .describe("ID of the moderator who performed the action."),
            performedByRole: z
              .enum(["moderator", "admin"])
              .describe(
                "Role of actor: 0=moderator, 1=admin (community-level or platform admin).",
              ),
            reason: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "Short text reason provided by the moderator (public explanation).",
              ),
            notes: z
              .string()
              .optional()
              .nullable()
              .describe(
                "Optional detailed moderator notes (private, not shown to user).",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Records each manual moderation action (approve, remove, lock, warn, temp-ban, etc.) performed on a post, comment, or user within a community for audit and workflow.",
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
    name: "listModerationActions",
    description:
      "List all moderation actions for a given community, user, or content item.",
    parameters: ListModerationActionsMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const listModerationActionsMcpController =
        new ListModerationActionsMcpController(mcpParams);
      try {
        const result =
          await listModerationActionsMcpController.processRequest();
        //return ListModerationActionsMcpController.getOutputSchema().parse(result);
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
