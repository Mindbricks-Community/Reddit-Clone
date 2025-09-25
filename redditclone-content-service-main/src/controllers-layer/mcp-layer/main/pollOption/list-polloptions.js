const { ListPollOptionsManager } = require("managers");
const { z } = require("zod");

const ContentMcpController = require("../../ContentServiceMcpController");

class ListPollOptionsMcpController extends ContentMcpController {
  constructor(params) {
    super("listPollOptions", "listpolloptions", params);
    this.dataName = "pollOptions";
    this.crudType = "getList";
  }

  createApiManager() {
    return new ListPollOptionsManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        pollOptions: z
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
    name: "listPollOptions",
    description: "List poll options for a poll post.",
    parameters: ListPollOptionsMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const listPollOptionsMcpController = new ListPollOptionsMcpController(
        mcpParams,
      );
      try {
        const result = await listPollOptionsMcpController.processRequest();
        //return ListPollOptionsMcpController.getOutputSchema().parse(result);
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
