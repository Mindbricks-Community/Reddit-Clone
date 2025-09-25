const { ListCommunityMembersManager } = require("managers");
const { z } = require("zod");

const CommunityMcpController = require("../../CommunityServiceMcpController");

class ListCommunityMembersMcpController extends CommunityMcpController {
  constructor(params) {
    super("listCommunityMembers", "listcommunitymembers", params);
    this.dataName = "communityMembers";
    this.crudType = "getList";
  }

  createApiManager() {
    return new ListCommunityMembersManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        communityMembers: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            communityId: z
              .string()
              .uuid()
              .describe("Reference to the community."),
            userId: z.string().uuid().describe("Reference to the user."),
            role: z
              .enum(["member", "moderator", "admin"])
              .describe(
                "Member role: 0=Member, 1=Moderator, 2=Admin (community-specific admin).",
              ),
            status: z
              .enum(["active", "pending", "banned", "invite_sent", "removed"])
              .describe(
                "Invite and join status: 0=active, 1=pending, 2=banned, 3=invite_sent, 4=removed.",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Tracks the user's membership/role in a community, including join status and granular role assignment (e.g., member, moderator, admin).",
          )
          .array(),
      })
      .describe("The response object of the crud route");
  }

  static getInputScheme() {
    return {};
  }
}

module.exports = (headers) => {
  return {
    name: "listCommunityMembers",
    description: "List the members of a community (all roles/statuses).",
    parameters: ListCommunityMembersMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const listCommunityMembersMcpController =
        new ListCommunityMembersMcpController(mcpParams);
      try {
        const result = await listCommunityMembersMcpController.processRequest();
        //return ListCommunityMembersMcpController.getOutputSchema().parse(result);
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
