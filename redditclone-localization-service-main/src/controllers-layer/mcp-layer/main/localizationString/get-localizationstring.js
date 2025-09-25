const { GetLocalizationStringManager } = require("managers");
const { z } = require("zod");

const LocalizationMcpController = require("../../LocalizationServiceMcpController");

class GetLocalizationStringMcpController extends LocalizationMcpController {
  constructor(params) {
    super("getLocalizationString", "getlocalizationstring", params);
    this.dataName = "localizationString";
    this.crudType = "get";
  }

  createApiManager() {
    return new GetLocalizationStringManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        localizationString: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            keyId: z
              .string()
              .uuid()
              .describe(
                "The ID of the localizationKey this string translates.",
              ),
            localeId: z
              .string()
              .uuid()
              .describe(
                "The ID of the locale for which this string is the translation.",
              ),
            value: z.string().describe("The actual translated string content."),
            status: z
              .enum(["pending", "inReview", "approved"])
              .describe(
                "Status of the translation: 0=pending, 1=inReview, 2=approved.",
              ),
            reviewNotes: z
              .string()
              .optional()
              .nullable()
              .describe(
                "Optional notes for translators or reviewers on this translation.",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Stores a translation of a localizationKey for a particular locale. Includes translation content, status, and metadata.",
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
      localizationStringId: z
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
    name: "getLocalizationString",
    description: "Fetch a localizationString by ID.",
    parameters: GetLocalizationStringMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const getLocalizationStringMcpController =
        new GetLocalizationStringMcpController(mcpParams);
      try {
        const result =
          await getLocalizationStringMcpController.processRequest();
        //return GetLocalizationStringMcpController.getOutputSchema().parse(result);
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
