const { ListCommentsManager } = require("managers");
const { z } = require("zod");

const ContentMcpController = require("../../ContentServiceMcpController");

class ListCommentsMcpController extends ContentMcpController {
  constructor(params) {
    super("listComments", "listcomments", params);
    this.dataName = "comments";
    this.crudType = "getList";
  }

  createApiManager() {
    return new ListCommentsManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        comments: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            postId: z
              .string()
              .uuid()
              .describe("Parent post to which this comment belongs."),
            userId: z.string().uuid().describe("User who wrote this comment."),
            parentCommentId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe(
                "Parent comment for threaded replies. Null if top-level comment.",
              ),
            threadPath: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "Path string representing the threaded ancestry of this comment (for efficient thread queries).",
              ),
            bodyText: z.string().describe("Content of the comment."),
            status: z
              .enum(["active", "deleted", "removed"])
              .describe("Comment status: active(0), deleted(1), removed(2)."),
            isNsfw: z.boolean().describe("Mark comment as NSFW."),
            upVotes: z
              .number()
              .int()
              .describe("Cached upvote count for the comment."),
            downVotes: z
              .number()
              .int()
              .describe("Cached downvote count for the comment."),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "A comment or threaded reply on a post. Supports parent-child replies (threading), text, voting, nsfw, deleted/removed status.",
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
    name: "listComments",
    description: "Get comments for a post, or threaded replies for a comment.",
    parameters: ListCommentsMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const listCommentsMcpController = new ListCommentsMcpController(
        mcpParams,
      );
      try {
        const result = await listCommentsMcpController.processRequest();
        //return ListCommentsMcpController.getOutputSchema().parse(result);
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
