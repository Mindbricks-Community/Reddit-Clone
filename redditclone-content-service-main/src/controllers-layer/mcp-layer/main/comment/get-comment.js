const { GetCommentManager } = require("managers");
const { z } = require("zod");

const ContentMcpController = require("../../ContentServiceMcpController");

class GetCommentMcpController extends ContentMcpController {
  constructor(params) {
    super("getComment", "getcomment", params);
    this.dataName = "comment";
    this.crudType = "get";
  }

  createApiManager() {
    return new GetCommentManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        comment: z
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
          ),
      })
      .describe("The response object of the crud route");
  }

  static getInputScheme() {
    return {
      commentId: z
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
    name: "getComment",
    description: "Get a single comment by its ID.",
    parameters: GetCommentMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const getCommentMcpController = new GetCommentMcpController(mcpParams);
      try {
        const result = await getCommentMcpController.processRequest();
        //return GetCommentMcpController.getOutputSchema().parse(result);
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
