const { GetLocalizationKeyManager } = require("managers");
const { z } = require("zod");

const LocalizationMcpController = require("../../LocalizationServiceMcpController");

class GetLocalizationKeyMcpController extends LocalizationMcpController {
  constructor(params) {
    super("getLocalizationKey", "getlocalizationkey", params);
    this.dataName = "localizationKey";
    this.crudType = "get";
  }

  createApiManager() {
    return new GetLocalizationKeyManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        localizationKey: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            uiKey: z
              .string()
              .max(255)
              .describe(
                "Unique key for string/message (e.g. app.feed.title, buttons.submit).",
              ),
            description: z
              .string()
              .optional()
              .nullable()
              .describe(
                "Explanation/context for translators or devs (e.g. where used in UI).",
              ),
            defaultValue: z
              .string()
              .describe("Default (English) string for this key."),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "A unique translatable key for platform strings/messages. Includes UI usage context and default English text.",
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
      localizationKeyId: z
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
    name: "getLocalizationKey",
    description: "Fetch a localization key by ID.",
    parameters: GetLocalizationKeyMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const getLocalizationKeyMcpController =
        new GetLocalizationKeyMcpController(mcpParams);
      try {
        const result = await getLocalizationKeyMcpController.processRequest();
        //return GetLocalizationKeyMcpController.getOutputSchema().parse(result);
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
