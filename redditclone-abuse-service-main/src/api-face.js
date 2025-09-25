const { inject } = require("mindbricks-api-face");

module.exports = (app) => {
  const authUrl = (process.env.SERVICE_URL ?? "mindbricks.com").replace(
    process.env.SERVICE_SHORT_NAME,
    "auth",
  );

  const config = {
    name: "redditclone - abuse",
    brand: {
      name: "redditclone",
      image: "https://mindbricks.com/favicon.ico",
      moduleName: "abuse",
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
        name: "AbuseReport",
        description:
          "Tracks each instance where a user or automated system reports abuse, spam, policy violation, or problematic behavior on a post, comment, or user. Includes reporter, reason, target links, status, result, and moderation review info.",
        reference: {
          tableName: "abuseReport",
          properties: [
            {
              name: "reportType",
              type: "Enum",
            },

            {
              name: "reportStatus",
              type: "Enum",
            },

            {
              name: "reasonText",
              type: "Text",
            },

            {
              name: "reporterUserId",
              type: "ID",
            },

            {
              name: "reportedUserId",
              type: "ID",
            },

            {
              name: "postId",
              type: "ID",
            },

            {
              name: "commentId",
              type: "ID",
            },

            {
              name: "origin",
              type: "Enum",
            },

            {
              name: "resolutionResult",
              type: "Enum",
            },

            {
              name: "resolvedByUserId",
              type: "ID",
            },

            {
              name: "extraData",
              type: "Object",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/abusereports/{abuseReportId}",
            title: "getAbuseReport",
            query: [],

            parameters: [
              {
                key: "abuseReportId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/abusereports",
            title: "createAbuseReport",
            query: [],

            body: {
              type: "json",
              content: {
                reportType: "Enum",
                reportStatus: "Enum",
                reasonText: "Text",
                reportedUserId: "ID",
                postId: "ID",
                commentId: "ID",
                origin: "Enum",
                resolutionResult: "Enum",
                resolvedByUserId: "ID",
                extraData: "Object",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/abusereports/{abuseReportId}",
            title: "updateAbuseReport",
            query: [],

            body: {
              type: "json",
              content: {
                reportStatus: "Enum",
                reasonText: "Text",
                resolutionResult: "Enum",
                resolvedByUserId: "ID",
                extraData: "Object",
              },
            },

            parameters: [
              {
                key: "abuseReportId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/abusereports/{abuseReportId}",
            title: "deleteAbuseReport",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "abuseReportId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/abusereports",
            title: "listAbuseReports",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "AbuseFlag",
        description:
          "Flags set automatically (machine/mod heuristics or batch mod actions) for (potential) abusive behavior. Linked to post, comment, user, or media. Used for marking, filtering, forwarding to moderation, or auto-restriction.",
        reference: {
          tableName: "abuseFlag",
          properties: [
            {
              name: "flagType",
              type: "Enum",
            },

            {
              name: "flagStatus",
              type: "Enum",
            },

            {
              name: "postId",
              type: "ID",
            },

            {
              name: "commentId",
              type: "ID",
            },

            {
              name: "userId",
              type: "ID",
            },

            {
              name: "mediaObjectId",
              type: "ID",
            },

            {
              name: "origin",
              type: "Enum",
            },

            {
              name: "details",
              type: "Object",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/abuseflags/{abuseFlagId}",
            title: "getAbuseFlag",
            query: [],

            parameters: [
              {
                key: "abuseFlagId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/abuseflags",
            title: "createAbuseFlag",
            query: [],

            body: {
              type: "json",
              content: {
                flagType: "Enum",
                flagStatus: "Enum",
                postId: "ID",
                commentId: "ID",
                userId: "ID",
                mediaObjectId: "ID",
                origin: "Enum",
                details: "Object",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/abuseflags/{abuseFlagId}",
            title: "updateAbuseFlag",
            query: [],

            body: {
              type: "json",
              content: {
                flagStatus: "Enum",
                details: "Object",
              },
            },

            parameters: [
              {
                key: "abuseFlagId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/abuseflags/{abuseFlagId}",
            title: "deleteAbuseFlag",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "abuseFlagId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/abuseflags",
            title: "listAbuseFlags",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "AbuseHeuristicTrigger",
        description:
          "Tracks anti-abuse/anti-spam system events: rate limits exceeded, spam/harassment heuristics, bulk/flooding events. Can be used for real-time throttling or investigation.",
        reference: {
          tableName: "abuseHeuristicTrigger",
          properties: [
            {
              name: "triggerType",
              type: "Enum",
            },

            {
              name: "userId",
              type: "ID",
            },

            {
              name: "ipAddress",
              type: "String",
            },

            {
              name: "targetId",
              type: "ID",
            },

            {
              name: "details",
              type: "Object",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/abuseheuristictriggers/{abuseHeuristicTriggerId}",
            title: "getAbuseHeuristicTrigger",
            query: [],

            parameters: [
              {
                key: "abuseHeuristicTriggerId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: false,
            method: "POST",
            url: "/abuseheuristictriggers",
            title: "createAbuseHeuristicTrigger",
            query: [],

            body: {
              type: "json",
              content: {
                triggerType: "Enum",
                userId: "ID",
                ipAddress: "String",
                targetId: "ID",
                details: "Object",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/abuseheuristictriggers/{abuseHeuristicTriggerId}",
            title: "updateAbuseHeuristicTrigger",
            query: [],

            body: {
              type: "json",
              content: {
                details: "Object",
              },
            },

            parameters: [
              {
                key: "abuseHeuristicTriggerId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/abuseheuristictriggers/{abuseHeuristicTriggerId}",
            title: "deleteAbuseHeuristicTrigger",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "abuseHeuristicTriggerId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/abuseheuristictriggers",
            title: "listAbuseHeuristicTriggers",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "AbuseInvestigation",
        description:
          "Tracks ongoing investigations performed by mods/admins on potential abuse cases (spam rings, coordinated attacks, large-scale harassment, etc) for documentation and escalation.",
        reference: {
          tableName: "abuseInvestigation",
          properties: [
            {
              name: "investigationStatus",
              type: "Enum",
            },

            {
              name: "title",
              type: "String",
            },

            {
              name: "openedByUserId",
              type: "ID",
            },

            {
              name: "assignedToUserIds",
              type: "[ID]",
            },

            {
              name: "relatedReportIds",
              type: "[ID]",
            },

            {
              name: "relatedFlagIds",
              type: "[ID]",
            },

            {
              name: "details",
              type: "Object",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/abuseinvestigations/{abuseInvestigationId}",
            title: "getAbuseInvestigation",
            query: [],

            parameters: [
              {
                key: "abuseInvestigationId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/abuseinvestigations",
            title: "createAbuseInvestigation",
            query: [],

            body: {
              type: "json",
              content: {
                investigationStatus: "Enum",
                title: "String",
                openedByUserId: "ID",
                assignedToUserIds: "ID",
                relatedReportIds: "ID",
                relatedFlagIds: "ID",
                details: "Object",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/abuseinvestigations/{abuseInvestigationId}",
            title: "updateAbuseInvestigation",
            query: [],

            body: {
              type: "json",
              content: {
                investigationStatus: "Enum",
                title: "String",
                assignedToUserIds: "ID",
                relatedReportIds: "ID",
                relatedFlagIds: "ID",
                details: "Object",
              },
            },

            parameters: [
              {
                key: "abuseInvestigationId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/abuseinvestigations/{abuseInvestigationId}",
            title: "deleteAbuseInvestigation",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "abuseInvestigationId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/abuseinvestigations",
            title: "listAbuseInvestigations",
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
