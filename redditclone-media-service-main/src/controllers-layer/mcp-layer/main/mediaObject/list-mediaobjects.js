const { ListMediaObjectsManager } = require("managers");
const { z } = require("zod");

const MediaMcpController = require("../../MediaServiceMcpController");

class ListMediaObjectsMcpController extends MediaMcpController {
  constructor(params) {
    super("listMediaObjects", "listmediaobjects", params);
    this.dataName = "mediaObjects";
    this.crudType = "getList";
  }

  createApiManager() {
    return new ListMediaObjectsManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        mediaObjects: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            ownerUserId: z
              .string()
              .uuid()
              .describe("ID of the user who uploaded/owns this media file."),
            mediaType: z
              .enum(["image", "video", "gif", "document", "audio", "other"])
              .describe(
                "Type of media: image, video, gif, document, audio, unknown.",
              ),
            originalUrl: z
              .string()
              .max(255)
              .describe("URL/path to the original uploaded file."),
            optimizedUrl: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "URL/path to the optimized/processed version (e.g., compressed, transcoded, resized).",
              ),
            previewUrl: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "URL/path to the preview image (thumbnail or short preview for video).",
              ),
            filename: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe("Original filename as uploaded by the user."),
            fileSize: z
              .number()
              .int()
              .optional()
              .nullable()
              .describe("Size of the uploaded file in bytes."),
            status: z
              .enum(["pending", "ready", "failed", "quarantined", "deleted"])
              .describe(
                "Processing/state status: 0=pending, 1=ready, 2=failed, 3=quarantined, 4=deleted.",
              ),
            nsfwScore: z
              .number()
              .optional()
              .nullable()
              .describe(
                "Latest NSFW probability/score (0-1); threshold can be used by clients for filtering.",
              ),
            malwareStatus: z
              .enum(["unknown", "clean", "flagged", "infected"])
              .optional()
              .nullable()
              .describe(
                "Malware scan result: 0=unknown, 1=clean, 2=flagged, 3=infected.",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Represents a user-uploaded media asset (image, video, gif, document, etc.). Stores metadata, ownership, processing and scan status, storage and delivery URLs.",
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
    name: "listMediaObjects",
    description:
      "Query and list media entries (filter by owner, type, status, etc).",
    parameters: ListMediaObjectsMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const listMediaObjectsMcpController = new ListMediaObjectsMcpController(
        mcpParams,
      );
      try {
        const result = await listMediaObjectsMcpController.processRequest();
        //return ListMediaObjectsMcpController.getOutputSchema().parse(result);
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
