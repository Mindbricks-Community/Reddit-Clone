const { DeleteCommentManager } = require("managers");
const { z } = require("zod");

const ContentMcpController = require("../../ContentServiceMcpController");

class DeleteCommentMcpController extends ContentMcpController {
  constructor(params) {
    super("deleteComment", "deletecomment", params);
    this.dataName = "comment";
    this.crudType = "delete";
  }

  createApiManager() {
    return new DeleteCommentManager(this.request, "mcp");
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
      accessToken: z
        .string()
        .optional()
        .describe(
          "The access token which is returned from a login request or given by user. This access token will override if there is any bearer or OAuth token in the mcp client. If not given the request will be made with the system (bearer or OAuth) token. For public routes you dont need to deifne any access token.",
        ),
      commentId: z
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
    name: "deleteComment",
    description: "Delete a comment (by author or moderator).",
    parameters: DeleteCommentMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const deleteCommentMcpController = new DeleteCommentMcpController(
        mcpParams,
      );
      try {
        const result = await deleteCommentMcpController.processRequest();
        //return DeleteCommentMcpController.getOutputSchema().parse(result);
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
