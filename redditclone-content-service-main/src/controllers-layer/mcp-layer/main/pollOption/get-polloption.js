const { GetPollOptionManager } = require("managers");
const { z } = require("zod");

const ContentMcpController = require("../../ContentServiceMcpController");

class GetPollOptionMcpController extends ContentMcpController {
  constructor(params) {
    super("getPollOption", "getpolloption", params);
    this.dataName = "pollOption";
    this.crudType = "get";
  }

  createApiManager() {
    return new GetPollOptionManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        pollOption: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            postId: z
              .string()
              .uuid()
              .describe("Post (of type 'poll') this option belongs to."),
            optionIndex: z
              .number()
              .int()
              .describe("Index of this poll option (0-based)."),
            optionText: z
              .string()
              .max(255)
              .describe("Text/label for this poll option."),
            voteCount: z
              .number()
              .int()
              .describe("Cached number of votes for this option."),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Option available to vote on for a poll-type post. Each poll-type post may have multiple poll options.",
          ),
      })
      .describe("The response object of the crud route");
  }

  static getInputScheme() {
    return {
      pollOptionId: z
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
    name: "getPollOption",
    description: "Get a single poll option (by ID).",
    parameters: GetPollOptionMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const getPollOptionMcpController = new GetPollOptionMcpController(
        mcpParams,
      );
      try {
        const result = await getPollOptionMcpController.processRequest();
        //return GetPollOptionMcpController.getOutputSchema().parse(result);
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
