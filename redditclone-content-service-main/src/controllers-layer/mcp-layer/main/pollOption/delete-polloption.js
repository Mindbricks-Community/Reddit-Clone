const { DeletePollOptionManager } = require("managers");
const { z } = require("zod");

const ContentMcpController = require("../../ContentServiceMcpController");

class DeletePollOptionMcpController extends ContentMcpController {
  constructor(params) {
    super("deletePollOption", "deletepolloption", params);
    this.dataName = "pollOption";
    this.crudType = "delete";
  }

  createApiManager() {
    return new DeletePollOptionManager(this.request, "mcp");
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
      accessToken: z
        .string()
        .optional()
        .describe(
          "The access token which is returned from a login request or given by user. This access token will override if there is any bearer or OAuth token in the mcp client. If not given the request will be made with the system (bearer or OAuth) token. For public routes you dont need to deifne any access token.",
        ),
      pollOptionId: z
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
    name: "deletePollOption",
    description: "Delete a poll option.",
    parameters: DeletePollOptionMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const deletePollOptionMcpController = new DeletePollOptionMcpController(
        mcpParams,
      );
      try {
        const result = await deletePollOptionMcpController.processRequest();
        //return DeletePollOptionMcpController.getOutputSchema().parse(result);
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
