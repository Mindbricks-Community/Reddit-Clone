const { ListModmailThreadsManager } = require("managers");
const { z } = require("zod");

const ModerationMcpController = require("../../ModerationServiceMcpController");

class ListModmailThreadsMcpController extends ModerationMcpController {
  constructor(params) {
    super("listModmailThreads", "listmodmailthreads", params);
    this.dataName = "modmailThreads";
    this.crudType = "getList";
  }

  createApiManager() {
    return new ListModmailThreadsManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        modmailThreads: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            communityId: z
              .string()
              .uuid()
              .describe("Community in which modmail is scoped."),
            subject: z
              .string()
              .max(255)
              .describe("Subject line of the thread."),
            createdByUserId: z
              .string()
              .uuid()
              .describe("User (or moderator) who created the thread."),
            status: z
              .enum(["open", "resolved", "archived", "deleted"])
              .describe(
                "Status of the thread: 0=open, 1=resolved, 2=archived, 3=deleted.",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Represents a modmail conversation thread between moderators and a user (or group, if extended). Thread is logical envelope for messages.",
          )
          .array(),
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
    };
  }
}

module.exports = (headers) => {
  return {
    name: "listModmailThreads",
    description: "List all modmail threads for a community or participant.",
    parameters: ListModmailThreadsMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const listModmailThreadsMcpController =
        new ListModmailThreadsMcpController(mcpParams);
      try {
        const result = await listModmailThreadsMcpController.processRequest();
        //return ListModmailThreadsMcpController.getOutputSchema().parse(result);
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
