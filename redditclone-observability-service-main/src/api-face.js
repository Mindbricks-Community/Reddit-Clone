const { inject } = require("mindbricks-api-face");

module.exports = (app) => {
  const authUrl = (process.env.SERVICE_URL ?? "mindbricks.com").replace(
    process.env.SERVICE_SHORT_NAME,
    "auth",
  );

  const config = {
    name: "redditclone - observability",
    brand: {
      name: "redditclone",
      image: "https://mindbricks.com/favicon.ico",
      moduleName: "observability",
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
        name: "SystemMetric",
        description:
          "A single point/time series metric (CPU, memory, error rate, etc.) collected from any service/module/host. Supports custom tags for dimensional filtering.",
        reference: {
          tableName: "systemMetric",
          properties: [
            {
              name: "timestamp",
              type: "Date",
            },

            {
              name: "serviceName",
              type: "String",
            },

            {
              name: "host",
              type: "String",
            },

            {
              name: "metricName",
              type: "String",
            },

            {
              name: "metricValue",
              type: "Double",
            },

            {
              name: "unit",
              type: "String",
            },

            {
              name: "tags",
              type: "Object",
            },
          ],
        },
        endpoints: [],
      },

      {
        name: "ErrorLog",
        description:
          "Captures application/system/business errors and warnings reported by all services. Includes context, severity, stack trace, and source metadata for audit/search/compliance.",
        reference: {
          tableName: "errorLog",
          properties: [
            {
              name: "timestamp",
              type: "Date",
            },

            {
              name: "serviceName",
              type: "String",
            },

            {
              name: "errorType",
              type: "String",
            },

            {
              name: "message",
              type: "Text",
            },

            {
              name: "severity",
              type: "Enum",
            },

            {
              name: "stackTrace",
              type: "Text",
            },

            {
              name: "context",
              type: "Object",
            },

            {
              name: "userId",
              type: "ID",
            },
          ],
        },
        endpoints: [],
      },

      {
        name: "SloEvent",
        description:
          "Represents a service-level SLO/SLA event (breach, recovery, ongoing issue). Includes status, incident type, affected services, and resolution notes.",
        reference: {
          tableName: "sloEvent",
          properties: [
            {
              name: "eventTime",
              type: "Date",
            },

            {
              name: "serviceName",
              type: "String",
            },

            {
              name: "eventType",
              type: "Enum",
            },

            {
              name: "status",
              type: "Enum",
            },

            {
              name: "notes",
              type: "Text",
            },
          ],
        },
        endpoints: [],
      },

      {
        name: "AuditLog",
        description:
          "General-purpose compliance and operational audit log for system events such as config changes, admin activities, permission grants, etc.",
        reference: {
          tableName: "auditLog",
          properties: [
            {
              name: "timestamp",
              type: "Date",
            },

            {
              name: "eventType",
              type: "String",
            },

            {
              name: "userId",
              type: "ID",
            },

            {
              name: "message",
              type: "Text",
            },

            {
              name: "targetType",
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
        endpoints: [],
      },

      {
        name: "Alert",
        description:
          "Tracks active or resolved alerts about incidents impacting reliability, SLO/SLA, or other central system signals. Alerts link to sloEvents and errorLogs as needed.",
        reference: {
          tableName: "alert",
          properties: [
            {
              name: "title",
              type: "String",
            },

            {
              name: "affectedServices",
              type: "[String]",
            },

            {
              name: "status",
              type: "Enum",
            },

            {
              name: "severity",
              type: "Enum",
            },

            {
              name: "sloEventIds",
              type: "[ID]",
            },

            {
              name: "errorLogIds",
              type: "[ID]",
            },

            {
              name: "resolvedByUserId",
              type: "ID",
            },

            {
              name: "notes",
              type: "Text",
            },
          ],
        },
        endpoints: [],
      },
    ],
  };

  inject(app, config);
};
