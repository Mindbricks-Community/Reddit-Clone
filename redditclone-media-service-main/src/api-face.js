const { inject } = require("mindbricks-api-face");

module.exports = (app) => {
  const authUrl = (process.env.SERVICE_URL ?? "mindbricks.com").replace(
    process.env.SERVICE_SHORT_NAME,
    "auth",
  );

  const config = {
    name: "redditclone - media",
    brand: {
      name: "redditclone",
      image: "https://mindbricks.com/favicon.ico",
      moduleName: "media",
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
        name: "MediaObject",
        description:
          "Represents a user-uploaded media asset (image, video, gif, document, etc.). Stores metadata, ownership, processing and scan status, storage and delivery URLs.",
        reference: {
          tableName: "mediaObject",
          properties: [
            {
              name: "ownerUserId",
              type: "ID",
            },

            {
              name: "mediaType",
              type: "Enum",
            },

            {
              name: "originalUrl",
              type: "String",
            },

            {
              name: "optimizedUrl",
              type: "String",
            },

            {
              name: "previewUrl",
              type: "String",
            },

            {
              name: "filename",
              type: "String",
            },

            {
              name: "fileSize",
              type: "Integer",
            },

            {
              name: "status",
              type: "Enum",
            },

            {
              name: "nsfwScore",
              type: "Float",
            },

            {
              name: "malwareStatus",
              type: "Enum",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/mediaobjects/{mediaObjectId}",
            title: "getMediaObject",
            query: [],

            parameters: [
              {
                key: "mediaObjectId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/mediaobjects",
            title: "createMediaObject",
            query: [],

            body: {
              type: "json",
              content: {
                mediaType: "Enum",
                originalUrl: "String",
                optimizedUrl: "String",
                previewUrl: "String",
                filename: "String",
                fileSize: "Integer",
                status: "Enum",
                nsfwScore: "Float",
                malwareStatus: "Enum",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/mediaobjects/{mediaObjectId}",
            title: "updateMediaObject",
            query: [],

            body: {
              type: "json",
              content: {
                optimizedUrl: "String",
                previewUrl: "String",
                status: "Enum",
                nsfwScore: "Float",
                malwareStatus: "Enum",
              },
            },

            parameters: [
              {
                key: "mediaObjectId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/mediaobjects/{mediaObjectId}",
            title: "deleteMediaObject",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "mediaObjectId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/mediaobjects",
            title: "listMediaObjects",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "MediaScan",
        description:
          "Represents a scan operation performed on a specific mediaObject (e.g., at upload or on-demand re-scan). Records type, results, and details for audit/history.",
        reference: {
          tableName: "mediaScan",
          properties: [
            {
              name: "mediaObjectId",
              type: "ID",
            },

            {
              name: "scanType",
              type: "Enum",
            },

            {
              name: "result",
              type: "Object",
            },

            {
              name: "scanStatus",
              type: "Enum",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/mediascans/{mediaScanId}",
            title: "getMediaScan",
            query: [],

            parameters: [
              {
                key: "mediaScanId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/mediascans",
            title: "createMediaScan",
            query: [],

            body: {
              type: "json",
              content: {
                mediaObjectId: "ID",
                scanType: "Enum",
                result: "Object",
                scanStatus: "Enum",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/mediascans/{mediaScanId}",
            title: "updateMediaScan",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "mediaScanId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/mediascans/{mediaScanId}",
            title: "deleteMediaScan",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "mediaScanId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/mediascans",
            title: "listMediaScans",
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
