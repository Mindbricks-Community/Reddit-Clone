const { DeleteVoteManager } = require("managers");
const { z } = require("zod");

const ContentMcpController = require("../../ContentServiceMcpController");

class DeleteVoteMcpController extends ContentMcpController {
  constructor(params) {
    super("deleteVote", "deletevote", params);
    this.dataName = "vote";
    this.crudType = "delete";
  }

  createApiManager() {
    return new DeleteVoteManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        vote: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            userId: z.string().uuid().describe("User who cast the vote."),
            postId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe(
                "Post that receives the vote (nullable if for comment).",
              ),
            commentId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe(
                "Comment that receives the vote (nullable if for post).",
              ),
            voteType: z
              .enum(["none", "upvote", "downvote"])
              .describe(
                "Direction/type of the vote. 0=none (neutral), 1=upvote, 2=downvote.",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Tracks upvote/downvote by user on a post or a comment. Used to prevent duplicate voting and aggregate score.",
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
      voteId: z
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
    name: "deleteVote",
    description: "Remove a vote for undoing engagement.",
    parameters: DeleteVoteMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const deleteVoteMcpController = new DeleteVoteMcpController(mcpParams);
      try {
        const result = await deleteVoteMcpController.processRequest();
        //return DeleteVoteMcpController.getOutputSchema().parse(result);
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
