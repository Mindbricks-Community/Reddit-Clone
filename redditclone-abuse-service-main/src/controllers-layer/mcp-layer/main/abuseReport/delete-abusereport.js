const { DeleteAbuseReportManager } = require("managers");
const { z } = require("zod");

const AbuseMcpController = require("../../AbuseServiceMcpController");

class DeleteAbuseReportMcpController extends AbuseMcpController {
  constructor(params) {
    super("deleteAbuseReport", "deleteabusereport", params);
    this.dataName = "abuseReport";
    this.crudType = "delete";
  }

  createApiManager() {
    return new DeleteAbuseReportManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        abuseReport: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            reportType: z
              .enum([
                "spam",
                "harassment",
                "ruleViolation",
                "nsfw",
                "malware",
                "selfHarm",
                "impersonation",
                "other",
              ])
              .describe(
                "Type of abuse being reported: spam, harassment, rules, nsfw, other.",
              ),
            reportStatus: z
              .enum([
                "new",
                "underReview",
                "forwarded",
                "resolved",
                "dismissed",
                "invalid",
              ])
              .describe(
                "Current status: new/queued, under_review, forwarded, resolved, dismissed, invalid.",
              ),
            reasonText: z
              .string()
              .optional()
              .nullable()
              .describe(
                "User-provided or system-generated explanation for report.",
              ),
            reporterUserId: z
              .string()
              .uuid()
              .describe("User who initiated the report."),
            reportedUserId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe(
                "User being reported (directly or as post/comment author).",
              ),
            postId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe("ID of the reported post (if applicable)."),
            commentId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe("ID of the reported comment (if applicable)."),
            origin: z
              .enum(["user", "automod", "external"])
              .describe(
                "Was report user-initiated/manual, automod, or external integration?",
              ),
            resolutionResult: z
              .enum([
                "none",
                "contentRemoved",
                "userRestricted",
                "noAction",
                "invalid",
                "banned",
                "other",
              ])
              .optional()
              .nullable()
              .describe(
                "Outcome: content actioned (removed...), dismissed, after mod/admin review. Null if unresolved.",
              ),
            resolvedByUserId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe(
                "Moderator/admin/automod (user)ID who resolved the report.",
              ),
            extraData: z
              .object()
              .optional()
              .nullable()
              .describe(
                "Flexible JSON for custom keys: browser, source IP, additional evidence, or attachment refs for mod workflow.",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Tracks each instance where a user or automated system reports abuse, spam, policy violation, or problematic behavior on a post, comment, or user. Includes reporter, reason, target links, status, result, and moderation review info.",
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
      abuseReportId: z
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
    name: "deleteAbuseReport",
    description:
      "Delete (or soft-delete) an abuse report (admin/mod action only).",
    parameters: DeleteAbuseReportMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const deleteAbuseReportMcpController = new DeleteAbuseReportMcpController(
        mcpParams,
      );
      try {
        const result = await deleteAbuseReportMcpController.processRequest();
        //return DeleteAbuseReportMcpController.getOutputSchema().parse(result);
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
