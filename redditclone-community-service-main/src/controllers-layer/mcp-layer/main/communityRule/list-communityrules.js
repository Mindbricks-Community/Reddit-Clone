const { ListCommunityRulesManager } = require("managers");
const { z } = require("zod");

const CommunityMcpController = require("../../CommunityServiceMcpController");

class ListCommunityRulesMcpController extends CommunityMcpController {
  constructor(params) {
    super("listCommunityRules", "listcommunityrules", params);
    this.dataName = "communityRules";
    this.crudType = "getList";
  }

  createApiManager() {
    return new ListCommunityRulesManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        communityRules: z
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
    name: "listCommunityRules",
    description: "List all rules for a specific community.",
    parameters: ListCommunityRulesMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const listCommunityRulesMcpController =
        new ListCommunityRulesMcpController(mcpParams);
      try {
        const result = await listCommunityRulesMcpController.processRequest();
        //return ListCommunityRulesMcpController.getOutputSchema().parse(result);
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
