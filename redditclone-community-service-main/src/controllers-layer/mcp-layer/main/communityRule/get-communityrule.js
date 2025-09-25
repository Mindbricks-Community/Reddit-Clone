const { GetCommunityRuleManager } = require("managers");
const { z } = require("zod");

const CommunityMcpController = require("../../CommunityServiceMcpController");

class GetCommunityRuleMcpController extends CommunityMcpController {
  constructor(params) {
    super("getCommunityRule", "getcommunityrule", params);
    this.dataName = "communityRule";
    this.crudType = "get";
  }

  createApiManager() {
    return new GetCommunityRuleManager(this.request, "mcp");
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
      communityRuleId: z
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
    name: "getCommunityRule",
    description: "Retrieve a specific rule by ID.",
    parameters: GetCommunityRuleMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const getCommunityRuleMcpController = new GetCommunityRuleMcpController(
        mcpParams,
      );
      try {
        const result = await getCommunityRuleMcpController.processRequest();
        //return GetCommunityRuleMcpController.getOutputSchema().parse(result);
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
