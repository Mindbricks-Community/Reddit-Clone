const { ListMediaScansManager } = require("managers");
const { z } = require("zod");

const MediaMcpController = require("../../MediaServiceMcpController");

class ListMediaScansMcpController extends MediaMcpController {
  constructor(params) {
    super("listMediaScans", "listmediascans", params);
    this.dataName = "mediaScans";
    this.crudType = "getList";
  }

  createApiManager() {
    return new ListMediaScansManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        mediaScans: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            mediaObjectId: z
              .string()
              .uuid()
              .describe("Reference to the mediaObject scanned."),
            scanType: z
              .enum(["nsfw", "malware", "other", "combined"])
              .describe(
                "Type of scan performed: 0=nsfw, 1=malware, 2=other, 3=combined.",
              ),
            result: z
              .object()
              .describe(
                "JSON-formatted scan result details: e.g., {nsfwScore:0.98, categories:['drawing','hentai']}, or malware: {clean:true,signature:'EICAR'}",
              ),
            scanStatus: z
              .enum(["pending", "success", "failed"])
              .describe("Scan record status: 0=pending, 1=success, 2=failed."),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Represents a scan operation performed on a specific mediaObject (e.g., at upload or on-demand re-scan). Records type, results, and details for audit/history.",
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
    name: "listMediaScans",
    description:
      "List all mediaScan records, optionally filter by mediaObjectId or scanType.",
    parameters: ListMediaScansMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const listMediaScansMcpController = new ListMediaScansMcpController(
        mcpParams,
      );
      try {
        const result = await listMediaScansMcpController.processRequest();
        //return ListMediaScansMcpController.getOutputSchema().parse(result);
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
