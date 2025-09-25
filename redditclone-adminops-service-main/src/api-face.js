const { inject } = require("mindbricks-api-face");

module.exports = (app) => {
  const authUrl = (process.env.SERVICE_URL ?? "mindbricks.com").replace(
    process.env.SERVICE_SHORT_NAME,
    "auth",
  );

  const config = {
    name: "redditclone - adminOps",
    brand: {
      name: "redditclone",
      image: "https://mindbricks.com/favicon.ico",
      moduleName: "adminOps",
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
        name: "AdminUserAction",
        description:
          "Logs platform-level administrative actions taken by admins (e.g., user ban, content removal, compliance actions) for audit and compliance purposes.",
        reference: {
          tableName: "adminUserAction",
          properties: [
            {
              name: "adminId",
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
              name: "actionType",
              type: "Enum",
            },

            {
              name: "reason",
              type: "String",
            },

            {
              name: "notes",
              type: "Text",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/adminuseractions/{adminUserActionId}",
            title: "getAdminUserAction",
            query: [],

            parameters: [
              {
                key: "adminUserActionId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/adminuseractions",
            title: "createAdminUserAction",
            query: [],

            body: {
              type: "json",
              content: {
                adminId: "ID",
                targetType: "Enum",
                targetId: "ID",
                actionType: "Enum",
                reason: "String",
                notes: "Text",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/adminuseractions/{adminUserActionId}",
            title: "updateAdminUserAction",
            query: [],

            body: {
              type: "json",
              content: {
                reason: "String",
                notes: "Text",
              },
            },

            parameters: [
              {
                key: "adminUserActionId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/adminuseractions/{adminUserActionId}",
            title: "deleteAdminUserAction",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "adminUserActionId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/adminuseractions",
            title: "listAdminUserActions",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "GdprExportRequest",
        description:
          "Tracks and manages user data export requests for GDPR compliance (user or admin-initiated).",
        reference: {
          tableName: "gdprExportRequest",
          properties: [
            {
              name: "userId",
              type: "ID",
            },

            {
              name: "requestedByAdminId",
              type: "ID",
            },

            {
              name: "status",
              type: "Enum",
            },

            {
              name: "exportUrl",
              type: "String",
            },

            {
              name: "errorMsg",
              type: "String",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/gdprexportrequests/{gdprExportRequestId}",
            title: "getGdprExportRequest",
            query: [],

            parameters: [
              {
                key: "gdprExportRequestId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/gdprexportrequests",
            title: "createGdprExportRequest",
            query: [],

            body: {
              type: "json",
              content: {
                userId: "ID",
                requestedByAdminId: "ID",
                status: "Enum",
                exportUrl: "String",
                errorMsg: "String",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/gdprexportrequests/{gdprExportRequestId}",
            title: "updateGdprExportRequest",
            query: [],

            body: {
              type: "json",
              content: {
                status: "Enum",
                exportUrl: "String",
                errorMsg: "String",
              },
            },

            parameters: [
              {
                key: "gdprExportRequestId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/gdprexportrequests/{gdprExportRequestId}",
            title: "deleteGdprExportRequest",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "gdprExportRequestId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/gdprexportrequests",
            title: "listGdprExportRequests",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "GdprDeleteRequest",
        description:
          "Tracks and manages user data/account erasure requests for GDPR compliance (user or admin-initiated).",
        reference: {
          tableName: "gdprDeleteRequest",
          properties: [
            {
              name: "userId",
              type: "ID",
            },

            {
              name: "requestedByAdminId",
              type: "ID",
            },

            {
              name: "status",
              type: "Enum",
            },

            {
              name: "errorMsg",
              type: "String",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/gdprdeleterequests/{gdprDeleteRequestId}",
            title: "getGdprDeleteRequest",
            query: [],

            parameters: [
              {
                key: "gdprDeleteRequestId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/gdprdeleterequests",
            title: "createGdprDeleteRequest",
            query: [],

            body: {
              type: "json",
              content: {
                userId: "ID",
                requestedByAdminId: "ID",
                status: "Enum",
                errorMsg: "String",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/gdprdeleterequests/{gdprDeleteRequestId}",
            title: "updateGdprDeleteRequest",
            query: [],

            body: {
              type: "json",
              content: {
                status: "Enum",
                errorMsg: "String",
              },
            },

            parameters: [
              {
                key: "gdprDeleteRequestId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/gdprdeleterequests/{gdprDeleteRequestId}",
            title: "deleteGdprDeleteRequest",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "gdprDeleteRequestId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/gdprdeleterequests",
            title: "listGdprDeleteRequests",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "CompliancePolicy",
        description:
          "Singleton object for sitewide compliance/configuration options (e.g., minimum age, GDPR export/erase policy).",
        reference: {
          tableName: "compliancePolicy",
          properties: [
            {
              name: "minAge",
              type: "Integer",
            },

            {
              name: "gdprExportEnabled",
              type: "Boolean",
            },

            {
              name: "gdprDeleteEnabled",
              type: "Boolean",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/compliancepolicies/{compliancePolicyId}",
            title: "getCompliancePolicy",
            query: [],

            parameters: [
              {
                key: "compliancePolicyId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/compliancepolicies",
            title: "createCompliancePolicy",
            query: [],

            body: {
              type: "json",
              content: {
                minAge: "Integer",
                gdprExportEnabled: "Boolean",
                gdprDeleteEnabled: "Boolean",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/compliancepolicies/{compliancePolicyId}",
            title: "updateCompliancePolicy",
            query: [],

            body: {
              type: "json",
              content: {
                minAge: "Integer",
                gdprExportEnabled: "Boolean",
                gdprDeleteEnabled: "Boolean",
              },
            },

            parameters: [
              {
                key: "compliancePolicyId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/compliancepolicies/{compliancePolicyId}",
            title: "deleteCompliancePolicy",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "compliancePolicyId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/compliancepolicies",
            title: "listCompliancePolicies",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "GlobalUserRestriction",
        description:
          "Tracks users globally banned, suspended, or shadowbanned at platform level (not per community).",
        reference: {
          tableName: "globalUserRestriction",
          properties: [
            {
              name: "userId",
              type: "ID",
            },

            {
              name: "restrictionType",
              type: "Enum",
            },

            {
              name: "status",
              type: "Enum",
            },

            {
              name: "startDate",
              type: "Date",
            },

            {
              name: "endDate",
              type: "Date",
            },

            {
              name: "reason",
              type: "String",
            },

            {
              name: "adminId",
              type: "ID",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/globaluserrestrictions/{globalUserRestrictionId}",
            title: "getGlobalUserRestriction",
            query: [],

            parameters: [
              {
                key: "globalUserRestrictionId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/globaluserrestrictions",
            title: "createGlobalUserRestriction",
            query: [],

            body: {
              type: "json",
              content: {
                userId: "ID",
                restrictionType: "Enum",
                status: "Enum",
                startDate: "Date",
                endDate: "Date",
                reason: "String",
                adminId: "ID",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/globaluserrestrictions/{globalUserRestrictionId}",
            title: "updateGlobalUserRestriction",
            query: [],

            body: {
              type: "json",
              content: {
                restrictionType: "Enum",
                status: "Enum",
                startDate: "Date",
                endDate: "Date",
                reason: "String",
                adminId: "ID",
              },
            },

            parameters: [
              {
                key: "globalUserRestrictionId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/globaluserrestrictions/{globalUserRestrictionId}",
            title: "deleteGlobalUserRestriction",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "globalUserRestrictionId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/globaluserrestrictions",
            title: "listGlobalUserRestrictions",
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
