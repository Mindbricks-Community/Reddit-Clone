const { UpdateCommunityManager } = require("managers");
const { z } = require("zod");

const CommunityMcpController = require("../../CommunityServiceMcpController");

class UpdateCommunityMcpController extends CommunityMcpController {
  constructor(params) {
    super("updateCommunity", "updatecommunity", params);
    this.dataName = "community";
    this.crudType = "update";
  }

  createApiManager() {
    return new UpdateCommunityManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        community: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            name: z
              .string()
              .max(255)
              .describe(
                "Community display name (must be unique and human readable).",
              ),
            slug: z
              .string()
              .max(255)
              .describe("Unique identifier for URLs (e.g., r/mycommunity)."),
            description: z
              .string()
              .describe(
                "Detailed description of the community's purpose and content.",
              ),
            creatorId: z
              .string()
              .uuid()
              .describe("ID of the user who created the community."),
            bannerUrl: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe("Banner image URL for top of the community page."),
            avatarUrl: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe("Logo or avatar image URL of the community."),
            colorScheme: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "Customizable color theme (e.g., for branding the community page).",
              ),
            privacyLevel: z
              .enum(["public", "restricted", "private"])
              .describe(
                "Privacy type: 0=public, 1=restricted (invite/key to post), 2=private.",
              ),
            isNsfw: z
              .boolean()
              .describe(
                "Indicates if the community is designated NSFW or adult.",
              ),
            allowedPostTypes: z.array(
              z
                .enum(["text", "link", "image", "video", "gallery", "poll"])
                .describe(
                  "Allowed content types (bit-enum): 0=text, 1=link, 2=image, 3=video, 4=gallery, 5=poll.",
                ),
            ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "A top-level user-created group for discussions, featuring configuration for privacy, allowed post types, appearance, rules, and trending/popularity tracking.",
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
      communityId: z
        .string()
        .uuid()
        .describe(
          "This id paremeter is used to select the required data object that will be updated",
        ),

      name: z
        .string()
        .max(255)
        .optional()
        .describe(
          "Community display name (must be unique and human readable).",
        ),

      description: z
        .string()
        .optional()
        .describe(
          "Detailed description of the community's purpose and content.",
        ),

      bannerUrl: z
        .string()
        .max(255)
        .optional()
        .describe("Banner image URL for top of the community page."),

      avatarUrl: z
        .string()
        .max(255)
        .optional()
        .describe("Logo or avatar image URL of the community."),

      colorScheme: z
        .string()
        .max(255)
        .optional()
        .describe(
          "Customizable color theme (e.g., for branding the community page).",
        ),

      privacyLevel: z
        .enum([])
        .optional()
        .describe(
          "Privacy type: 0=public, 1=restricted (invite/key to post), 2=private.",
        ),

      isNsfw: z
        .boolean()
        .optional()
        .describe("Indicates if the community is designated NSFW or adult."),

      allowedPostTypes: z
        .enum([])
        .optional()
        .describe(
          "Allowed content types (bit-enum): 0=text, 1=link, 2=image, 3=video, 4=gallery, 5=poll.",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "updateCommunity",
    description:
      "Update community info, appearance, privacy, allowed post types, or settings.",
    parameters: UpdateCommunityMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const updateCommunityMcpController = new UpdateCommunityMcpController(
        mcpParams,
      );
      try {
        const result = await updateCommunityMcpController.processRequest();
        //return UpdateCommunityMcpController.getOutputSchema().parse(result);
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
