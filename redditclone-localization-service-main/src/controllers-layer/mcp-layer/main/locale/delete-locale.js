const { DeleteLocaleManager } = require("managers");
const { z } = require("zod");

const LocalizationMcpController = require("../../LocalizationServiceMcpController");

class DeleteLocaleMcpController extends LocalizationMcpController {
  constructor(params) {
    super("deleteLocale", "deletelocale", params);
    this.dataName = "locale";
    this.crudType = "delete";
  }

  createApiManager() {
    return new DeleteLocaleManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        locale: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            localeCode: z
              .string()
              .max(255)
              .describe("IETF language/region code, e.g., en, en-US, tr-TR."),
            displayName: z
              .string()
              .max(255)
              .describe(
                "Localized name for this locale (e.g., English, Türkçe).",
              ),
            direction: z
              .enum(["ltr", "rtl"])
              .describe("Text direction for the locale: 0=LTR, 1=RTL."),
            enabled: z
              .boolean()
              .describe("Is this locale enabled and available for use?"),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Represents a supported language/locale for translations. Includes code (e.g., en-US), display name, direction, and enabled status.",
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
      localeId: z
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
    name: "deleteLocale",
    description: "Soft-delete a locale by ID.",
    parameters: DeleteLocaleMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const deleteLocaleMcpController = new DeleteLocaleMcpController(
        mcpParams,
      );
      try {
        const result = await deleteLocaleMcpController.processRequest();
        //return DeleteLocaleMcpController.getOutputSchema().parse(result);
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
