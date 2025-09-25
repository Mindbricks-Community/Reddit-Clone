const { ListLocalesManager } = require("managers");
const { z } = require("zod");

const LocalizationMcpController = require("../../LocalizationServiceMcpController");

class ListLocalesMcpController extends LocalizationMcpController {
  constructor(params) {
    super("listLocales", "listlocales", params);
    this.dataName = "locales";
    this.crudType = "getList";
  }

  createApiManager() {
    return new ListLocalesManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        locales: z
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
    name: "listLocales",
    description: "Get a list of all supported locales.",
    parameters: ListLocalesMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const listLocalesMcpController = new ListLocalesMcpController(mcpParams);
      try {
        const result = await listLocalesMcpController.processRequest();
        //return ListLocalesMcpController.getOutputSchema().parse(result);
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
