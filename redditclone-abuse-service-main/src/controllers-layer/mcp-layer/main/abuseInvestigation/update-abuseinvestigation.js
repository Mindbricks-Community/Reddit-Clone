const { UpdateAbuseInvestigationManager } = require("managers");
const { z } = require("zod");

const AbuseMcpController = require("../../AbuseServiceMcpController");

class UpdateAbuseInvestigationMcpController extends AbuseMcpController {
  constructor(params) {
    super("updateAbuseInvestigation", "updateabuseinvestigation", params);
    this.dataName = "abuseInvestigation";
    this.crudType = "update";
  }

  createApiManager() {
    return new UpdateAbuseInvestigationManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        abuseInvestigation: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            investigationStatus: z
              .enum([
                "open",
                "inProgress",
                "closed",
                "escalated",
                "dismissed",
                "duplicate",
              ])
              .describe(
                "Status of investigation (open, inProgress, closed, escalated, dismissed, duplicate)",
              ),
            title: z
              .string()
              .max(255)
              .describe(
                "Short title or summary describing the investigation topic.",
              ),
            openedByUserId: z
              .string()
              .uuid()
              .describe("Moderator/admin user who opened the investigation."),
            assignedToUserIds: z.array(
              z
                .string()
                .uuid()
                .optional()
                .nullable()
                .describe(
                  "Array of IDs of mods/admins currently active on the investigation.",
                ),
            ),
            relatedReportIds: z.array(
              z
                .string()
                .uuid()
                .optional()
                .nullable()
                .describe(
                  "Array of abuseReport ids this investigation covers.",
                ),
            ),
            relatedFlagIds: z.array(
              z
                .string()
                .uuid()
                .optional()
                .nullable()
                .describe(
                  "Array of abuseFlag ids handled in this investigation.",
                ),
            ),
            details: z
              .object()
              .optional()
              .nullable()
              .describe(
                "Flexible details/log field (timeline, findings, next actions, etc).",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Tracks ongoing investigations performed by mods/admins on potential abuse cases (spam rings, coordinated attacks, large-scale harassment, etc) for documentation and escalation.",
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
      abuseInvestigationId: z
        .string()
        .uuid()
        .describe(
          "This id paremeter is used to select the required data object that will be updated",
        ),

      investigationStatus: z
        .enum([])
        .optional()
        .describe(
          "Status of investigation (open, inProgress, closed, escalated, dismissed, duplicate)",
        ),

      title: z
        .string()
        .max(255)
        .optional()
        .describe("Short title or summary describing the investigation topic."),

      assignedToUserIds: z
        .string()
        .uuid()
        .optional()
        .describe(
          "Array of IDs of mods/admins currently active on the investigation.",
        ),

      relatedReportIds: z
        .string()
        .uuid()
        .optional()
        .describe("Array of abuseReport ids this investigation covers."),

      relatedFlagIds: z
        .string()
        .uuid()
        .optional()
        .describe("Array of abuseFlag ids handled in this investigation."),

      details: z
        .object({})
        .optional()
        .describe(
          "Flexible details/log field (timeline, findings, next actions, etc).",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "updateAbuseInvestigation",
    description: "Update status/title/details etc. for an abuse investigation.",
    parameters: UpdateAbuseInvestigationMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const updateAbuseInvestigationMcpController =
        new UpdateAbuseInvestigationMcpController(mcpParams);
      try {
        const result =
          await updateAbuseInvestigationMcpController.processRequest();
        //return UpdateAbuseInvestigationMcpController.getOutputSchema().parse(result);
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
