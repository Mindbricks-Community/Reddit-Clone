const { GetPostMediaManager } = require("managers");
const { z } = require("zod");

const ContentMcpController = require("../../ContentServiceMcpController");

class GetPostMediaMcpController extends ContentMcpController {
  constructor(params) {
    super("getPostMedia", "getpostmedia", params);
    this.dataName = "postMedia";
    this.crudType = "get";
  }

  createApiManager() {
    return new GetPostMediaManager(this.request, "mcp");
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
      postMediaId: z
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
    name: "getPostMedia",
    description: "Get a specific postMedia association.",
    parameters: GetPostMediaMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const getPostMediaMcpController = new GetPostMediaMcpController(
        mcpParams,
      );
      try {
        const result = await getPostMediaMcpController.processRequest();
        //return GetPostMediaMcpController.getOutputSchema().parse(result);
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
