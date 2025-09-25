const { GetCommunityPinnedManager } = require("managers");
const { z } = require("zod");

const CommunityMcpController = require("../../CommunityServiceMcpController");

class GetCommunityPinnedMcpController extends CommunityMcpController {
  constructor(params) {
    super("getCommunityPinned", "getcommunitypinned", params);
    this.dataName = "communityPinned";
    this.crudType = "get";
  }

  createApiManager() {
    return new GetCommunityPinnedManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        communityPinned: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            communityId: z
              .string()
              .uuid()
              .describe("Community this pinned item is for."),
            targetType: z
              .enum(["post", "rule", "announcement"])
              .describe("Type of pinned item: 0=post, 1=rule, 2=announcement."),
            targetId: z
              .string()
              .uuid()
              .describe(
                "ID of the post, rule, or announcement that is pinned.",
              ),
            orderIndex: z
              .number()
              .int()
              .describe("Ordering for display among pinned items."),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "A post, rule, or announcement pinned to the top/front of a community.",
          ),
      })
      .describe("The response object of the crud route");
  }

  static getInputScheme() {
    return {
      communityPinnedId: z
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
    name: "getCommunityPinned",
    description: "Get pinned item by ID.",
    parameters: GetCommunityPinnedMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const getCommunityPinnedMcpController =
        new GetCommunityPinnedMcpController(mcpParams);
      try {
        const result = await getCommunityPinnedMcpController.processRequest();
        //return GetCommunityPinnedMcpController.getOutputSchema().parse(result);
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
