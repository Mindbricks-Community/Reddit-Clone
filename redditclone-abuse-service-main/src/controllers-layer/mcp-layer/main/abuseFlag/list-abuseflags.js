const { ListAbuseFlagsManager } = require("managers");
const { z } = require("zod");

const AbuseMcpController = require("../../AbuseServiceMcpController");

class ListAbuseFlagsMcpController extends AbuseMcpController {
  constructor(params) {
    super("listAbuseFlags", "listabuseflags", params);
    this.dataName = "abuseFlags";
    this.crudType = "getList";
  }

  createApiManager() {
    return new ListAbuseFlagsManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        abuseFlags: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            flagType: z
              .enum([
                "spam",
                "nsfw",
                "rateAbuse",
                "suspicious",
                "malware",
                "banEvasion",
                "automodCustom",
                "other",
              ])
              .describe(
                "Type of flag (spam, nsfw, ban-evasion, rate-abuse, suspicious, malware, automodCustom, other).",
              ),
            flagStatus: z
              .enum([
                "active",
                "reviewed",
                "dismissed",
                "escalated",
                "resolved",
                "suppressed",
              ])
              .describe(
                "Status of the flag (active, reviewed, dismissed, escalated, resolved, suppressed).",
              ),
            postId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe(
                "Flagged post (optional, mutually exclusive with commentId, userId, mediaObjectId).",
              ),
            commentId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe(
                "Flagged comment (optional, mutually exclusive with postId, userId, mediaObjectId).",
              ),
            userId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe("Flagged user (optional, mutually exclusive)."),
            mediaObjectId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe(
                "Flagged media object (optional, for NSFW/malware/other).",
              ),
            origin: z
              .enum(["automod", "rateLimiter", "modtool", "admin", "external"])
              .describe(
                "What set this flag: automod, rate-limiter, modtool, admin, external.",
              ),
            details: z
              .object()
              .optional()
              .nullable()
              .describe(
                "Flexible field for context such as reason, scores, automod pattern, IP data, evidence, timestamps, etc.",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Flags set automatically (machine/mod heuristics or batch mod actions) for (potential) abusive behavior. Linked to post, comment, user, or media. Used for marking, filtering, forwarding to moderation, or auto-restriction.",
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
    name: "listAbuseFlags",
    description:
      "List and filter all flags (by status, type, target, origin, etc.).",
    parameters: ListAbuseFlagsMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const listAbuseFlagsMcpController = new ListAbuseFlagsMcpController(
        mcpParams,
      );
      try {
        const result = await listAbuseFlagsMcpController.processRequest();
        //return ListAbuseFlagsMcpController.getOutputSchema().parse(result);
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
