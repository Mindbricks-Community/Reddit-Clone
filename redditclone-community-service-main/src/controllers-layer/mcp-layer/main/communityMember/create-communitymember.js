const { CreateCommunityMemberManager } = require("managers");
const { z } = require("zod");

const CommunityMcpController = require("../../CommunityServiceMcpController");

class CreateCommunityMemberMcpController extends CommunityMcpController {
  constructor(params) {
    super("createCommunityMember", "createcommunitymember", params);
    this.dataName = "communityMember";
    this.crudType = "create";
  }

  createApiManager() {
    return new CreateCommunityMemberManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        communityMember: z
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
    };
  }
}

module.exports = (headers) => {
  return {
    name: "createCommunityMember",
    description:
      "Create a community member entry. User joins or is invited to a community.",
    parameters: CreateCommunityMemberMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const createCommunityMemberMcpController =
        new CreateCommunityMemberMcpController(mcpParams);
      try {
        const result =
          await createCommunityMemberMcpController.processRequest();
        //return CreateCommunityMemberMcpController.getOutputSchema().parse(result);
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
