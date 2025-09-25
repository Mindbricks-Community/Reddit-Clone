const { GetPostManager } = require("managers");
const { z } = require("zod");

const ContentMcpController = require("../../ContentServiceMcpController");

class GetPostMcpController extends ContentMcpController {
  constructor(params) {
    super("getPost", "getpost", params);
    this.dataName = "post";
    this.crudType = "get";
  }

  createApiManager() {
    return new GetPostManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        post: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            communityId: z
              .string()
              .uuid()
              .describe("Community to which the post belongs."),
            userId: z.string().uuid().describe("User who created this post."),
            title: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "Title of the post. Required except for image/gallery-only posts.",
              ),
            bodyText: z
              .string()
              .optional()
              .nullable()
              .describe(
                "Text content of the post. Required for text posts; optional for others.",
              ),
            externalUrl: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe("Target URL for link posts (YouTube, news, etc)."),
            postType: z
              .enum(["text", "link", "image", "video", "gallery", "poll"])
              .describe(
                "Type of post: text, link, image, video, gallery, poll.",
              ),
            status: z
              .enum(["active", "deleted", "locked", "removed"])
              .describe(
                "Post status: active (0), deleted (1), locked (2), removed(3).",
              ),
            isNsfw: z.boolean().describe("Whether the post is marked NSFW."),
            upVotes: z
              .number()
              .int()
              .describe("Cached number of upvotes for the post."),
            downVotes: z
              .number()
              .int()
              .describe("Cached number of downvotes for the post."),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "A user-created content submission to a community. Supports formats: text, link, image, video, gallery, poll. Includes metadata, status, voting tallies, filtering, and media references.",
          ),
      })
      .describe("The response object of the crud route");
  }

  static getInputScheme() {
    return {
      postId: z
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
    name: "getPost",
    description: "Get a single post by its ID.",
    parameters: GetPostMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const getPostMcpController = new GetPostMcpController(mcpParams);
      try {
        const result = await getPostMcpController.processRequest();
        //return GetPostMcpController.getOutputSchema().parse(result);
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
