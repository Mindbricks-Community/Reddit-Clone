const { DeletePostManager } = require("managers");
const { z } = require("zod");

const ContentMcpController = require("../../ContentServiceMcpController");

class DeletePostMcpController extends ContentMcpController {
  constructor(params) {
    super("deletePost", "deletepost", params);
    this.dataName = "post";
    this.crudType = "delete";
  }

  createApiManager() {
    return new DeletePostManager(this.request, "mcp");
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
      accessToken: z
        .string()
        .optional()
        .describe(
          "The access token which is returned from a login request or given by user. This access token will override if there is any bearer or OAuth token in the mcp client. If not given the request will be made with the system (bearer or OAuth) token. For public routes you dont need to deifne any access token.",
        ),
      postId: z
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
    name: "deletePost",
    description:
      "Delete a post (by author or moderator, marks as deleted/removed).",
    parameters: DeletePostMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const deletePostMcpController = new DeletePostMcpController(mcpParams);
      try {
        const result = await deletePostMcpController.processRequest();
        //return DeletePostMcpController.getOutputSchema().parse(result);
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
