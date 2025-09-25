const { UpdateModmailMessageManager } = require("managers");
const { z } = require("zod");

const ModerationMcpController = require("../../ModerationServiceMcpController");

class UpdateModmailMessageMcpController extends ModerationMcpController {
  constructor(params) {
    super("updateModmailMessage", "updatemodmailmessage", params);
    this.dataName = "modmailMessage";
    this.crudType = "update";
  }

  createApiManager() {
    return new UpdateModmailMessageManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        modmailMessage: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            threadId: z
              .string()
              .uuid()
              .describe("Reference to the parent modmail thread."),
            senderUserId: z
              .string()
              .uuid()
              .describe("User/moderator who sent this message."),
            messageBody: z.string().describe("Body of the modmail message."),
            messageType: z
              .enum(["user", "moderator", "system"])
              .describe("Type of message: 0=user, 1=moderator, 2=system."),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "A message sent as part of a modmail thread; can be by a moderator or a user.",
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
      modmailMessageId: z
        .string()
        .uuid()
        .describe(
          "This id paremeter is used to select the required data object that will be updated",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "updateModmailMessage",
    description:
      "Update a modmail message (only allowed for sender, if at all).",
    parameters: UpdateModmailMessageMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const updateModmailMessageMcpController =
        new UpdateModmailMessageMcpController(mcpParams);
      try {
        const result = await updateModmailMessageMcpController.processRequest();
        //return UpdateModmailMessageMcpController.getOutputSchema().parse(result);
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
