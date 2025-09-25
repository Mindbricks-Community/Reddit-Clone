const { UpdateCommunityPinnedManager } = require("managers");
const { z } = require("zod");

const CommunityMcpController = require("../../CommunityServiceMcpController");

class UpdateCommunityPinnedMcpController extends CommunityMcpController {
  constructor(params) {
    super("updateCommunityPinned", "updatecommunitypinned", params);
    this.dataName = "communityPinned";
    this.crudType = "update";
  }

  createApiManager() {
    return new UpdateCommunityPinnedManager(this.request, "mcp");
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
      accessToken: z
        .string()
        .optional()
        .describe(
          "The access token which is returned from a login request or given by user. This access token will override if there is any bearer or OAuth token in the mcp client. If not given the request will be made with the system (bearer or OAuth) token. For public routes you dont need to deifne any access token.",
        ),
      communityPinnedId: z
        .string()
        .uuid()
        .describe(
          "This id paremeter is used to select the required data object that will be updated",
        ),

      targetType: z
        .enum([])
        .optional()
        .describe("Type of pinned item: 0=post, 1=rule, 2=announcement."),

      orderIndex: z
        .number()
        .int()
        .optional()
        .describe("Ordering for display among pinned items."),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "updateCommunityPinned",
    description: "Reorder or update a pinned item.",
    parameters: UpdateCommunityPinnedMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const updateCommunityPinnedMcpController =
        new UpdateCommunityPinnedMcpController(mcpParams);
      try {
        const result =
          await updateCommunityPinnedMcpController.processRequest();
        //return UpdateCommunityPinnedMcpController.getOutputSchema().parse(result);
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
