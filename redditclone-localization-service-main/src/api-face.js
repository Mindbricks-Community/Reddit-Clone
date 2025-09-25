const { inject } = require("mindbricks-api-face");

module.exports = (app) => {
  const authUrl = (process.env.SERVICE_URL ?? "mindbricks.com").replace(
    process.env.SERVICE_SHORT_NAME,
    "auth",
  );

  const config = {
    name: "redditclone - localization",
    brand: {
      name: "redditclone",
      image: "https://mindbricks.com/favicon.ico",
      moduleName: "localization",
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
        name: "Locale",
        description:
          "Represents a supported language/locale for translations. Includes code (e.g., en-US), display name, direction, and enabled status.",
        reference: {
          tableName: "locale",
          properties: [
            {
              name: "localeCode",
              type: "String",
            },

            {
              name: "displayName",
              type: "String",
            },

            {
              name: "direction",
              type: "Enum",
            },

            {
              name: "enabled",
              type: "Boolean",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/locales/{localeId}",
            title: "getLocale",
            query: [],

            parameters: [
              {
                key: "localeId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/locales",
            title: "createLocale",
            query: [],

            body: {
              type: "json",
              content: {
                localeCode: "String",
                displayName: "String",
                direction: "Enum",
                enabled: "Boolean",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/locales/{localeId}",
            title: "updateLocale",
            query: [],

            body: {
              type: "json",
              content: {
                displayName: "String",
                direction: "Enum",
                enabled: "Boolean",
              },
            },

            parameters: [
              {
                key: "localeId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/locales/{localeId}",
            title: "deleteLocale",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "localeId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/locales",
            title: "listLocales",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "LocalizationKey",
        description:
          "A unique translatable key for platform strings/messages. Includes UI usage context and default English text.",
        reference: {
          tableName: "localizationKey",
          properties: [
            {
              name: "uiKey",
              type: "String",
            },

            {
              name: "description",
              type: "Text",
            },

            {
              name: "defaultValue",
              type: "Text",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/localizationkeys/{localizationKeyId}",
            title: "getLocalizationKey",
            query: [],

            parameters: [
              {
                key: "localizationKeyId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/localizationkeys",
            title: "createLocalizationKey",
            query: [],

            body: {
              type: "json",
              content: {
                uiKey: "String",
                description: "Text",
                defaultValue: "Text",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/localizationkeys/{localizationKeyId}",
            title: "updateLocalizationKey",
            query: [],

            body: {
              type: "json",
              content: {
                description: "Text",
                defaultValue: "Text",
              },
            },

            parameters: [
              {
                key: "localizationKeyId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/localizationkeys/{localizationKeyId}",
            title: "deleteLocalizationKey",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "localizationKeyId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/localizationkeys",
            title: "listLocalizationKeys",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "LocalizationString",
        description:
          "Stores a translation of a localizationKey for a particular locale. Includes translation content, status, and metadata.",
        reference: {
          tableName: "localizationString",
          properties: [
            {
              name: "keyId",
              type: "ID",
            },

            {
              name: "localeId",
              type: "ID",
            },

            {
              name: "value",
              type: "Text",
            },

            {
              name: "status",
              type: "Enum",
            },

            {
              name: "reviewNotes",
              type: "Text",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/localizationstrings/{localizationStringId}",
            title: "getLocalizationString",
            query: [],

            parameters: [
              {
                key: "localizationStringId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/localizationstrings",
            title: "createLocalizationString",
            query: [],

            body: {
              type: "json",
              content: {
                keyId: "ID",
                localeId: "ID",
                value: "Text",
                status: "Enum",
                reviewNotes: "Text",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/localizationstrings/{localizationStringId}",
            title: "updateLocalizationString",
            query: [],

            body: {
              type: "json",
              content: {
                value: "Text",
                status: "Enum",
                reviewNotes: "Text",
              },
            },

            parameters: [
              {
                key: "localizationStringId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/localizationstrings/{localizationStringId}",
            title: "deleteLocalizationString",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "localizationStringId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/localizationstrings",
            title: "listLocalizationStrings",
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
