const { DeletePostMediaManager } = require("managers");
const { z } = require("zod");

const ContentMcpController = require("../../ContentServiceMcpController");

class DeletePostMediaMcpController extends ContentMcpController {
  constructor(params) {
    super("deletePostMedia", "deletepostmedia", params);
    this.dataName = "postMedia";
    this.crudType = "delete";
  }

  createApiManager() {
    return new DeletePostMediaManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        postMedia: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            mediaObjectId: z
              .string()
              .uuid()
              .describe("ID of media object stored in media service."),
            postId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe("Referencing post, if any."),
            commentId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe("Referencing comment, if any."),
            mediaIndex: z
              .number()
              .int()
              .describe("Order for display in gallery/media list."),
            caption: z
              .string()
              .optional()
              .nullable()
              .describe(
                "Optional caption/description for this media instance in the post or comment.",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Associates media (images/videos) to a post or comment, allowing galleries and ordering. Media is owned by media service, this is the cross-ref with ordering/meta.",
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
      postMediaId: z
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
    name: "deletePostMedia",
    description: "Remove postMedia association.",
    parameters: DeletePostMediaMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const deletePostMediaMcpController = new DeletePostMediaMcpController(
        mcpParams,
      );
      try {
        const result = await deletePostMediaMcpController.processRequest();
        //return DeletePostMediaMcpController.getOutputSchema().parse(result);
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
