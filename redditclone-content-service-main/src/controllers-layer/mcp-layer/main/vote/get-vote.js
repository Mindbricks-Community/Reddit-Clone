const { GetVoteManager } = require("managers");
const { z } = require("zod");

const ContentMcpController = require("../../ContentServiceMcpController");

class GetVoteMcpController extends ContentMcpController {
  constructor(params) {
    super("getVote", "getvote", params);
    this.dataName = "vote";
    this.crudType = "get";
  }

  createApiManager() {
    return new GetVoteManager(this.request, "mcp");
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
      voteId: z
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
    name: "getVote",
    description: "Get a single vote (by ID) for admin/debug.",
    parameters: GetVoteMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const getVoteMcpController = new GetVoteMcpController(mcpParams);
      try {
        const result = await getVoteMcpController.processRequest();
        //return GetVoteMcpController.getOutputSchema().parse(result);
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
