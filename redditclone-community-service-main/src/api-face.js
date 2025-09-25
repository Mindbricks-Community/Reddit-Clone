const { inject } = require("mindbricks-api-face");

module.exports = (app) => {
  const authUrl = (process.env.SERVICE_URL ?? "mindbricks.com").replace(
    process.env.SERVICE_SHORT_NAME,
    "auth",
  );

  const config = {
    name: "redditclone - community",
    brand: {
      name: "redditclone",
      image: "https://mindbricks.com/favicon.ico",
      moduleName: "community",
      version: process.env.SERVICE_VERSION || "1.0.0",
    },
    auth: {
      url: authUrl,
      loginPath: "/login",
      logoutPath: "/logout",
      currentUserPath: "/currentuser",
      authStrategy: "external",
      initialAuth: true,
    },
    dataObjects: [
      {
        name: "Community",
        description:
          "A top-level user-created group for discussions, featuring configuration for privacy, allowed post types, appearance, rules, and trending/popularity tracking.",
        reference: {
          tableName: "community",
          properties: [
            {
              name: "name",
              type: "String",
            },

            {
              name: "slug",
              type: "String",
            },

            {
              name: "description",
              type: "Text",
            },

            {
              name: "creatorId",
              type: "ID",
            },

            {
              name: "bannerUrl",
              type: "String",
            },

            {
              name: "avatarUrl",
              type: "String",
            },

            {
              name: "colorScheme",
              type: "String",
            },

            {
              name: "privacyLevel",
              type: "Enum",
            },

            {
              name: "isNsfw",
              type: "Boolean",
            },

            {
              name: "allowedPostTypes",
              type: "[Enum]",
            },
          ],
        },
        endpoints: [
          {
            isAuth: false,
            method: "GET",
            url: "/communities/{communityId}",
            title: "getCommunity",
            query: [],

            parameters: [
              {
                key: "communityId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/communities",
            title: "createCommunity",
            query: [],

            body: {
              type: "json",
              content: {
                name: "String",
                slug: "String",
                description: "Text",
                bannerUrl: "String",
                avatarUrl: "String",
                colorScheme: "String",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/communities/{communityId}",
            title: "updateCommunity",
            query: [],

            body: {
              type: "json",
              content: {
                name: "String",
                description: "Text",
                bannerUrl: "String",
                avatarUrl: "String",
                colorScheme: "String",
                privacyLevel: "Enum",
                isNsfw: "Boolean",
                allowedPostTypes: "Enum",
              },
            },

            parameters: [
              {
                key: "communityId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/communities/{communityId}",
            title: "deleteCommunity",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "communityId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: false,
            method: "GET",
            url: "/communities",
            title: "listCommunities",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "CommunityMember",
        description:
          "Tracks the user&#39;s membership/role in a community, including join status and granular role assignment (e.g., member, moderator, admin).",
        reference: {
          tableName: "communityMember",
          properties: [
            {
              name: "communityId",
              type: "ID",
            },

            {
              name: "userId",
              type: "ID",
            },

            {
              name: "role",
              type: "Enum",
            },

            {
              name: "status",
              type: "Enum",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/communitymembers/{communityMemberId}",
            title: "getCommunityMember",
            query: [],

            parameters: [
              {
                key: "communityMemberId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/communitymembers",
            title: "createCommunityMember",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/communitymembers/{communityMemberId}",
            title: "updateCommunityMember",
            query: [],

            body: {
              type: "json",
              content: {
                role: "Enum",
                status: "Enum",
              },
            },

            parameters: [
              {
                key: "communityMemberId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/communitymembers/{communityMemberId}",
            title: "deleteCommunityMember",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "communityMemberId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: false,
            method: "GET",
            url: "/communitymembers",
            title: "listCommunityMembers",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "CommunityRule",
        description:
          "A rule or guideline defined by moderators of a community. Enforced by moderators and/or automod.",
        reference: {
          tableName: "communityRule",
          properties: [
            {
              name: "communityId",
              type: "ID",
            },

            {
              name: "shortName",
              type: "String",
            },

            {
              name: "description",
              type: "Text",
            },

            {
              name: "orderIndex",
              type: "Integer",
            },
          ],
        },
        endpoints: [
          {
            isAuth: false,
            method: "GET",
            url: "/communityrules/{communityRuleId}",
            title: "getCommunityRule",
            query: [],

            parameters: [
              {
                key: "communityRuleId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/communityrules",
            title: "createCommunityRule",
            query: [],

            body: {
              type: "json",
              content: {
                shortName: "String",
                description: "Text",
                orderIndex: "Integer",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/communityrules/{communityRuleId}",
            title: "updateCommunityRule",
            query: [],

            body: {
              type: "json",
              content: {
                shortName: "String",
                description: "Text",
                orderIndex: "Integer",
              },
            },

            parameters: [
              {
                key: "communityRuleId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/communityrules/{communityRuleId}",
            title: "deleteCommunityRule",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "communityRuleId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: false,
            method: "GET",
            url: "/communityrules",
            title: "listCommunityRules",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "CommunityPinned",
        description:
          "A post, rule, or announcement pinned to the top/front of a community.",
        reference: {
          tableName: "communityPinned",
          properties: [
            {
              name: "communityId",
              type: "ID",
            },

            {
              name: "targetType",
              type: "Enum",
            },

            {
              name: "targetId",
              type: "ID",
            },

            {
              name: "orderIndex",
              type: "Integer",
            },
          ],
        },
        endpoints: [
          {
            isAuth: false,
            method: "GET",
            url: "/communitypinneds/{communityPinnedId}",
            title: "getCommunityPinned",
            query: [],

            parameters: [
              {
                key: "communityPinnedId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/communitypinneds",
            title: "createCommunityPinned",
            query: [],

            body: {
              type: "json",
              content: {
                orderIndex: "Integer",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/communitypinneds/{communityPinnedId}",
            title: "updateCommunityPinned",
            query: [],

            body: {
              type: "json",
              content: {
                targetType: "Enum",
                orderIndex: "Integer",
              },
            },

            parameters: [
              {
                key: "communityPinnedId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/communitypinneds/{communityPinnedId}",
            title: "deleteCommunityPinned",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "communityPinnedId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: false,
            method: "GET",
            url: "/communitypinned",
            title: "listCommunityPinned",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "CommunityAutomodSetting",
        description:
          "Configurable automoderator rules and settings for each community; triggers for keyword/content/pattern-based moderation.",
        reference: {
          tableName: "communityAutomodSetting",
          properties: [
            {
              name: "communityId",
              type: "ID",
            },

            {
              name: "rulesData",
              type: "Object",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/communityautomodsettings/{communityAutomodSettingId}",
            title: "getCommunityAutomodSetting",
            query: [],

            parameters: [
              {
                key: "communityAutomodSettingId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/communityautomodsettings",
            title: "createCommunityAutomodSetting",
            query: [],

            body: {
              type: "json",
              content: {
                rulesData: "Object",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/communityautomodsettings/{communityAutomodSettingId}",
            title: "updateCommunityAutomodSetting",
            query: [],

            body: {
              type: "json",
              content: {
                rulesData: "Object",
              },
            },

            parameters: [
              {
                key: "communityAutomodSettingId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/communityautomodsettings/{communityAutomodSettingId}",
            title: "deleteCommunityAutomodSetting",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "communityAutomodSettingId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/communityautomodsettings",
            title: "listCommunityAutomodSettings",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },
    ],
  };

  inject(app, config);
};
