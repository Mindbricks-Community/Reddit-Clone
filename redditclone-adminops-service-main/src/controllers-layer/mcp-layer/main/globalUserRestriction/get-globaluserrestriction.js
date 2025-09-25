const { GetGlobalUserRestrictionManager } = require("managers");
const { z } = require("zod");

const AdminOpsMcpController = require("../../AdminOpsServiceMcpController");

class GetGlobalUserRestrictionMcpController extends AdminOpsMcpController {
  constructor(params) {
    super("getGlobalUserRestriction", "getglobaluserrestriction", params);
    this.dataName = "globalUserRestriction";
    this.crudType = "get";
  }

  createApiManager() {
    return new GetGlobalUserRestrictionManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        globalUserRestriction: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            userId: z.string().uuid().describe("User ID being restricted"),
            restrictionType: z
              .enum(["ban", "suspend", "shadowban"])
              .describe("Restriction type: ban, suspend, shadowban"),
            status: z
              .enum(["active", "revoked", "expired"])
              .describe("Status of restriction: active, revoked, expired"),
            startDate: z
              .string()
              .optional()
              .nullable()
              .describe("Start time of restriction (UTC)"),
            endDate: z
              .string()
              .optional()
              .nullable()
              .describe("End time of restriction (UTC, null if indefinite)"),
            reason: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe("Public reason for restriction"),
            adminId: z
              .string()
              .uuid()
              .optional()
              .nullable()
              .describe("Admin ID who issued/revoked the restriction"),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Tracks users globally banned, suspended, or shadowbanned at platform level (not per community).",
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
      globalUserRestrictionId: z
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
    name: "getGlobalUserRestriction",
    description: "Get global user restriction record by ID.",
    parameters: GetGlobalUserRestrictionMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const getGlobalUserRestrictionMcpController =
        new GetGlobalUserRestrictionMcpController(mcpParams);
      try {
        const result =
          await getGlobalUserRestrictionMcpController.processRequest();
        //return GetGlobalUserRestrictionMcpController.getOutputSchema().parse(result);
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
