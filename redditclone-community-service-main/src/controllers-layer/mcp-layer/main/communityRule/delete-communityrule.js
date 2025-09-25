const { DeleteCommunityRuleManager } = require("managers");
const { z } = require("zod");

const CommunityMcpController = require("../../CommunityServiceMcpController");

class DeleteCommunityRuleMcpController extends CommunityMcpController {
  constructor(params) {
    super("deleteCommunityRule", "deletecommunityrule", params);
    this.dataName = "communityRule";
    this.crudType = "delete";
  }

  createApiManager() {
    return new DeleteCommunityRuleManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        communityRule: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            communityId: z
              .string()
              .uuid()
              .describe("Community this rule belongs to."),
            shortName: z
              .string()
              .max(255)
              .describe("Short display name for the rule."),
            description: z
              .string()
              .describe("Detailed explanation of the rule."),
            orderIndex: z
              .number()
              .int()
              .describe("Ordering/priority of the rule within its community."),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "A rule or guideline defined by moderators of a community. Enforced by moderators and/or automod.",
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
      communityRuleId: z
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
    name: "deleteCommunityRule",
    description: "Delete a rule from a community.",
    parameters: DeleteCommunityRuleMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const deleteCommunityRuleMcpController =
        new DeleteCommunityRuleMcpController(mcpParams);
      try {
        const result = await deleteCommunityRuleMcpController.processRequest();
        //return DeleteCommunityRuleMcpController.getOutputSchema().parse(result);
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
