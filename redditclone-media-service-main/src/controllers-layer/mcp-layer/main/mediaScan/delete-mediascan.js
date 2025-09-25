const { DeleteMediaScanManager } = require("managers");
const { z } = require("zod");

const MediaMcpController = require("../../MediaServiceMcpController");

class DeleteMediaScanMcpController extends MediaMcpController {
  constructor(params) {
    super("deleteMediaScan", "deletemediascan", params);
    this.dataName = "mediaScan";
    this.crudType = "delete";
  }

  createApiManager() {
    return new DeleteMediaScanManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        mediaScan: z
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
      mediaScanId: z
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
    name: "deleteMediaScan",
    description: "Soft-delete a mediaScan record (if allowed).",
    parameters: DeleteMediaScanMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const deleteMediaScanMcpController = new DeleteMediaScanMcpController(
        mcpParams,
      );
      try {
        const result = await deleteMediaScanMcpController.processRequest();
        //return DeleteMediaScanMcpController.getOutputSchema().parse(result);
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
