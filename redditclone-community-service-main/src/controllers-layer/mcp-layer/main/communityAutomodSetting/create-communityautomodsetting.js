const { CreateCommunityAutomodSettingManager } = require("managers");
const { z } = require("zod");

const CommunityMcpController = require("../../CommunityServiceMcpController");

class CreateCommunityAutomodSettingMcpController extends CommunityMcpController {
  constructor(params) {
    super(
      "createCommunityAutomodSetting",
      "createcommunityautomodsetting",
      params,
    );
    this.dataName = "communityAutomodSetting";
    this.crudType = "create";
  }

  createApiManager() {
    return new CreateCommunityAutomodSettingManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        communityAutomodSetting: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            communityId: z
              .string()
              .uuid()
              .describe("Community this automod setting applies to."),
            rulesData: z
              .object()
              .describe(
                "JSON-structured data for all automod rules, triggers, and config for the community.",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Configurable automoderator rules and settings for each community; triggers for keyword/content/pattern-based moderation.",
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
      rulesData: z
        .object({})
        .describe(
          "JSON-structured data for all automod rules, triggers, and config for the community.",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "createCommunityAutomodSetting",
    description: "Create automod rules/settings for a community.",
    parameters: CreateCommunityAutomodSettingMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const createCommunityAutomodSettingMcpController =
        new CreateCommunityAutomodSettingMcpController(mcpParams);
      try {
        const result =
          await createCommunityAutomodSettingMcpController.processRequest();
        //return CreateCommunityAutomodSettingMcpController.getOutputSchema().parse(result);
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
