const { CreateLocalizationKeyManager } = require("managers");
const { z } = require("zod");

const LocalizationMcpController = require("../../LocalizationServiceMcpController");

class CreateLocalizationKeyMcpController extends LocalizationMcpController {
  constructor(params) {
    super("createLocalizationKey", "createlocalizationkey", params);
    this.dataName = "localizationKey";
    this.crudType = "create";
  }

  createApiManager() {
    return new CreateLocalizationKeyManager(this.request, "mcp");
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
      uiKey: z
        .string()
        .max(255)
        .describe(
          "Unique key for string/message (e.g. app.feed.title, buttons.submit).",
        ),

      description: z
        .string()
        .optional()
        .describe(
          "Explanation/context for translators or devs (e.g. where used in UI).",
        ),

      defaultValue: z
        .string()
        .describe("Default (English) string for this key."),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "createLocalizationKey",
    description: "Create a new localization key and (optionally) English text.",
    parameters: CreateLocalizationKeyMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const createLocalizationKeyMcpController =
        new CreateLocalizationKeyMcpController(mcpParams);
      try {
        const result =
          await createLocalizationKeyMcpController.processRequest();
        //return CreateLocalizationKeyMcpController.getOutputSchema().parse(result);
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
