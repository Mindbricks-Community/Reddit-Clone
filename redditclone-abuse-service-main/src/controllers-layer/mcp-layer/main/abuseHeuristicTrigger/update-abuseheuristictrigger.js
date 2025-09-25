const { UpdateAbuseHeuristicTriggerManager } = require("managers");
const { z } = require("zod");

const AbuseMcpController = require("../../AbuseServiceMcpController");

class UpdateAbuseHeuristicTriggerMcpController extends AbuseMcpController {
  constructor(params) {
    super("updateAbuseHeuristicTrigger", "updateabuseheuristictrigger", params);
    this.dataName = "abuseHeuristicTrigger";
    this.crudType = "update";
  }

  createApiManager() {
    return new UpdateAbuseHeuristicTriggerManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        abuseHeuristicTrigger: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            triggerType: z
              .enum([
                "rateExceeded",
                "floodAttempt",
                "spamPattern",
                "abusePhrase",
                "botSuspect",
                "multiAccount",
                "rapidVote",
                "other",
              ])
              .describe(
                "Kind of trigger: rate-exceeded, flood attempt, spam, abusePhrase, botSuspect, multiAccount, rapidVote, other.",
              ),
            userId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe(
                "Affected or triggering user (if any, e.g. rate limited).",
              ),
            ipAddress: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "Source IP address/origination (for rate limits, bot detection, etc).",
              ),
            targetId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe("ID of post/comment/content/other entity if relevant."),
            details: z
              .object()
              .optional()
              .nullable()
              .describe(
                "Flexible metadata (why, how many attempts, evidence, automod pattern, query params, timing, etc).",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Tracks anti-abuse/anti-spam system events: rate limits exceeded, spam/harassment heuristics, bulk/flooding events. Can be used for real-time throttling or investigation.",
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
      abuseHeuristicTriggerId: z
        .string()
        .uuid()
        .describe(
          "This id paremeter is used to select the required data object that will be updated",
        ),

      details: z
        .object({})
        .optional()
        .describe(
          "Flexible metadata (why, how many attempts, evidence, automod pattern, query params, timing, etc).",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "updateAbuseHeuristicTrigger",
    description:
      "Update fields/details of heuristic triggers (e.g., marking as reviewed, resolved, or adding investigation links).",
    parameters: UpdateAbuseHeuristicTriggerMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const updateAbuseHeuristicTriggerMcpController =
        new UpdateAbuseHeuristicTriggerMcpController(mcpParams);
      try {
        const result =
          await updateAbuseHeuristicTriggerMcpController.processRequest();
        //return UpdateAbuseHeuristicTriggerMcpController.getOutputSchema().parse(result);
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
