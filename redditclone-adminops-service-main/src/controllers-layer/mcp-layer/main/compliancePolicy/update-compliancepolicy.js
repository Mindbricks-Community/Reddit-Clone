const { UpdateCompliancePolicyManager } = require("managers");
const { z } = require("zod");

const AdminOpsMcpController = require("../../AdminOpsServiceMcpController");

class UpdateCompliancePolicyMcpController extends AdminOpsMcpController {
  constructor(params) {
    super("updateCompliancePolicy", "updatecompliancepolicy", params);
    this.dataName = "compliancePolicy";
    this.crudType = "update";
  }

  createApiManager() {
    return new UpdateCompliancePolicyManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        compliancePolicy: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            minAge: z
              .number()
              .int()
              .describe("Minimum allowed user age (in years)"),
            gdprExportEnabled: z
              .boolean()
              .describe("Sitewide toggle for GDPR data export availability"),
            gdprDeleteEnabled: z
              .boolean()
              .describe("Sitewide toggle for GDPR delete/erasure availability"),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Singleton object for sitewide compliance/configuration options (e.g., minimum age, GDPR export/erase policy).",
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
      compliancePolicyId: z
        .string()
        .uuid()
        .describe(
          "This id paremeter is used to select the required data object that will be updated",
        ),

      minAge: z.number().int().describe("Minimum allowed user age (in years)"),

      gdprExportEnabled: z
        .boolean()
        .describe("Sitewide toggle for GDPR data export availability"),

      gdprDeleteEnabled: z
        .boolean()
        .describe("Sitewide toggle for GDPR delete/erasure availability"),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "updateCompliancePolicy",
    description: "Update sitewide compliance policy config.",
    parameters: UpdateCompliancePolicyMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const updateCompliancePolicyMcpController =
        new UpdateCompliancePolicyMcpController(mcpParams);
      try {
        const result =
          await updateCompliancePolicyMcpController.processRequest();
        //return UpdateCompliancePolicyMcpController.getOutputSchema().parse(result);
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
