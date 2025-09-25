const { ListCommunityPinnedManager } = require("managers");
const { z } = require("zod");

const CommunityMcpController = require("../../CommunityServiceMcpController");

class ListCommunityPinnedMcpController extends CommunityMcpController {
  constructor(params) {
    super("listCommunityPinned", "listcommunitypinned", params);
    this.dataName = "communityPinneds";
    this.crudType = "getList";
  }

  createApiManager() {
    return new ListCommunityPinnedManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        communityPinneds: z
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
    name: "listCommunityPinned",
    description: "List all pinned items for a community.",
    parameters: ListCommunityPinnedMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const listCommunityPinnedMcpController =
        new ListCommunityPinnedMcpController(mcpParams);
      try {
        const result = await listCommunityPinnedMcpController.processRequest();
        //return ListCommunityPinnedMcpController.getOutputSchema().parse(result);
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
