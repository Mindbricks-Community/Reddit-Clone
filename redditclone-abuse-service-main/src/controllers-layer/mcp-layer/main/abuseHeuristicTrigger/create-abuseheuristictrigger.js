const { CreateAbuseHeuristicTriggerManager } = require("managers");
const { z } = require("zod");

const AbuseMcpController = require("../../AbuseServiceMcpController");

class CreateAbuseHeuristicTriggerMcpController extends AbuseMcpController {
  constructor(params) {
    super("createAbuseHeuristicTrigger", "createabuseheuristictrigger", params);
    this.dataName = "abuseHeuristicTrigger";
    this.crudType = "create";
  }

  createApiManager() {
    return new CreateAbuseHeuristicTriggerManager(this.request, "mcp");
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
      triggerType: z
        .enum([])
        .describe(
          "Kind of trigger: rate-exceeded, flood attempt, spam, abusePhrase, botSuspect, multiAccount, rapidVote, other.",
        ),

      userId: z
        .string()
        .uuid()
        .optional()
        .describe("Affected or triggering user (if any, e.g. rate limited)."),

      ipAddress: z
        .string()
        .max(255)
        .optional()
        .describe(
          "Source IP address/origination (for rate limits, bot detection, etc).",
        ),

      targetId: z
        .string()
        .uuid()
        .optional()
        .describe("ID of post/comment/content/other entity if relevant."),

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
    name: "createAbuseHeuristicTrigger",
    description:
      "Insert an anti-abuse system event for rate limit/heuristics (rate-limit, spam, bot, etc).",
    parameters: CreateAbuseHeuristicTriggerMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const createAbuseHeuristicTriggerMcpController =
        new CreateAbuseHeuristicTriggerMcpController(mcpParams);
      try {
        const result =
          await createAbuseHeuristicTriggerMcpController.processRequest();
        //return CreateAbuseHeuristicTriggerMcpController.getOutputSchema().parse(result);
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
