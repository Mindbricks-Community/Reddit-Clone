const { UpdateModmailThreadManager } = require("managers");
const { z } = require("zod");

const ModerationMcpController = require("../../ModerationServiceMcpController");

class UpdateModmailThreadMcpController extends ModerationMcpController {
  constructor(params) {
    super("updateModmailThread", "updatemodmailthread", params);
    this.dataName = "modmailThread";
    this.crudType = "update";
  }

  createApiManager() {
    return new UpdateModmailThreadManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        modmailThread: z
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
      modmailThreadId: z
        .string()
        .uuid()
        .describe(
          "This id paremeter is used to select the required data object that will be updated",
        ),

      subject: z
        .string()
        .max(255)
        .optional()
        .describe("Subject line of the thread."),

      status: z
        .enum([])
        .optional()
        .describe(
          "Status of the thread: 0=open, 1=resolved, 2=archived, 3=deleted.",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "updateModmailThread",
    description: "Update a modmail thread&#39;s status or subject.",
    parameters: UpdateModmailThreadMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const updateModmailThreadMcpController =
        new UpdateModmailThreadMcpController(mcpParams);
      try {
        const result = await updateModmailThreadMcpController.processRequest();
        //return UpdateModmailThreadMcpController.getOutputSchema().parse(result);
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
