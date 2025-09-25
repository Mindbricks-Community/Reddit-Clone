const { ListPostMediaManager } = require("managers");
const { z } = require("zod");

const ContentMcpController = require("../../ContentServiceMcpController");

class ListPostMediaMcpController extends ContentMcpController {
  constructor(params) {
    super("listPostMedia", "listpostmedia", params);
    this.dataName = "postMedias";
    this.crudType = "getList";
  }

  createApiManager() {
    return new ListPostMediaManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        postMedias: z
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
    name: "listPostMedia",
    description:
      "List media objects associated to a post or comment (with ordering/captions).",
    parameters: ListPostMediaMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const listPostMediaMcpController = new ListPostMediaMcpController(
        mcpParams,
      );
      try {
        const result = await listPostMediaMcpController.processRequest();
        //return ListPostMediaMcpController.getOutputSchema().parse(result);
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
