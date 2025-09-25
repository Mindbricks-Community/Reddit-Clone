const { CreateCompliancePolicyManager } = require("managers");
const { z } = require("zod");

const AdminOpsMcpController = require("../../AdminOpsServiceMcpController");

class CreateCompliancePolicyMcpController extends AdminOpsMcpController {
  constructor(params) {
    super("createCompliancePolicy", "createcompliancepolicy", params);
    this.dataName = "compliancePolicy";
    this.crudType = "create";
  }

  createApiManager() {
    return new CreateCompliancePolicyManager(this.request, "mcp");
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
    name: "createCompliancePolicy",
    description:
      "Create sitewide compliance policy config (should be only one).",
    parameters: CreateCompliancePolicyMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const createCompliancePolicyMcpController =
        new CreateCompliancePolicyMcpController(mcpParams);
      try {
        const result =
          await createCompliancePolicyMcpController.processRequest();
        //return CreateCompliancePolicyMcpController.getOutputSchema().parse(result);
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
